import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Form, Row, Modal, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import {
  useAddProjectPayment,
  useUpdateProjectPayment,
} from '../../queries/project_payments_query';

const PaymentFormModal = ({
  isOpen,
  toggle,
  projectId,
  isEdit = false,
  paymentData = {},
}) => {
  const { t } = useTranslation();

  const addPaymentMutation = useAddProjectPayment(projectId);
  const updatePaymentMutation = useUpdateProjectPayment(projectId);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required(t('field_required'))
      .positive('Amount must be positive'),
    payment_date: Yup.date().required(t('field_required')),
    payment_method: Yup.string().required(t('field_required')),
    status: Yup.string().required(t('field_required')),
    receipt_number: Yup.string(),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      project: projectId,
      amount: isEdit ? paymentData.amount || '' : '',
      payment_date: isEdit ? paymentData.payment_date || '' : '',
      payment_method: isEdit ? paymentData.payment_method || '' : '',
      status: isEdit ? paymentData.status || '' : '',
      receipt_number: isEdit ? paymentData.receipt_number || '' : '',
      description: isEdit ? paymentData.description || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEdit) {
          await updatePaymentMutation.mutateAsync({
            id: paymentData.id,
            ...values,
          });
        } else {
          await addPaymentMutation.mutateAsync(values);
        }
        resetForm();
        toggle();
      } catch {
        // Error handling is managed globally by QueryProvider
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isMutationPending =
    addPaymentMutation.isPending || updatePaymentMutation.isPending;

  return (
    <Modal size="lg" show={isOpen} onHide={toggle} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit
            ? t('edit_payment', { id: paymentData.id })
            : t('add_payment')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <NumberField formik={formik} fieldId={'amount'} />
            <Input
              type="date"
              formik={formik}
              fieldId={'payment_date'}
              label={t('payment_date')}
            />
            <AsyncSelectField
              formik={formik}
              fieldId={'payment_method'}
              label={t('payment_method')}
              optionMap={{
                cash: t('Cash'),
                bank_transfer: t('Bank Transfer'),
                check: t('Check'),
                credit_card: t('Credit Card'),
              }}
            />
            <AsyncSelectField
              formik={formik}
              fieldId={'status'}
              label={t('status')}
              optionMap={{
                pending: t('Pending'),
                completed: t('Completed'),
                failed: t('Failed'),
              }}
            />
            <Input formik={formik} fieldId={'receipt_number'} />
            <Input
              className="col-md-12"
              formik={formik}
              fieldId={'description'}
              type="textarea"
            />
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={toggle}
          disabled={isMutationPending}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={formik.submitForm}
          disabled={
            formik.isSubmitting ||
            isMutationPending ||
            !formik.isValid ||
            !formik.dirty
          }
        >
          {isMutationPending && (
            <Spinner size="sm" className="me-1" animation="border" />
          )}
          {isEdit ? t('update') : t('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PaymentFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  paymentData: PropTypes.object,
};

export default PaymentFormModal;
