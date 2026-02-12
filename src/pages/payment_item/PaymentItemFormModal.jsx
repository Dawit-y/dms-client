import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Form, Row, Modal, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import {
  useAddPaymentItem,
  useUpdatePaymentItem,
} from '../../queries/payment_items_query';

const PaymentItemFormModal = ({
  isOpen,
  toggle,
  paymentId,
  isEdit = false,
  itemData = {},
}) => {
  const { t } = useTranslation();

  const addPaymentItemMutation = useAddPaymentItem(paymentId);
  const updatePaymentItemMutation = useUpdatePaymentItem(paymentId);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field_required')),
    quantity: Yup.number()
      .required(t('field_required'))
      .positive('Quantity must be positive'),
    unit_price: Yup.number()
      .required(t('field_required'))
      .positive('Unit Price must be positive'),
  });

  const formik = useFormik({
    initialValues: {
      payment: paymentId,
      name: isEdit ? itemData.name || '' : '',
      quantity: isEdit ? itemData.quantity || '' : '',
      unit_price: isEdit ? itemData.unit_price || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEdit) {
          await updatePaymentItemMutation.mutateAsync({
            id: itemData.id,
            ...values,
          });
        } else {
          await addPaymentItemMutation.mutateAsync(values);
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
    addPaymentItemMutation.isPending || updatePaymentItemMutation.isPending;

  return (
    <Modal size="lg" show={isOpen} onHide={toggle} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit
            ? t('edit_item', { item: itemData.name })
            : t('add_payment_item')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input formik={formik} fieldId={'name'} label={t('item_name')} />
            <NumberField
              formik={formik}
              fieldId={'quantity'}
              label={t('quantity')}
            />
            <NumberField
              formik={formik}
              fieldId={'unit_price'}
              label={t('unit_price')}
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
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PaymentItemFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  paymentId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  itemData: PropTypes.object,
};

export default PaymentItemFormModal;
