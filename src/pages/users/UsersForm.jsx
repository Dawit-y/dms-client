import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { Form, Row, Card, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import * as Yup from 'yup';

import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import { useAddUser, useUpdateUser } from '../../queries/users_query';

const UsersForm = ({ isEdit = false, rowData = {}, isDuplicate = false }) => {
  const submitActionRef = useRef(null);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();

  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(t('field_required')),
    last_name: Yup.string().required(t('field_required')),
    email: Yup.string().email(t('invalid_email')).required(t('field_required')),
    phone_number: Yup.string().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      first_name: rowData?.first_name || '',
      last_name: rowData?.last_name || '',
      email: isEdit ? rowData?.email || '' : '',
      phone_number: isEdit ? rowData?.phone_number || '' : '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let userId;
        if (isEdit) {
          await updateUserMutation.mutateAsync({
            id: id || rowData.id,
            ...values,
          });
          userId = id || rowData.id;
        } else {
          const result = await addUserMutation.mutateAsync(values);
          userId = result?.id;
        }

        if (submitActionRef.current === 'close') {
          navigate(-1);
        }

        if (submitActionRef.current === 'view') {
          const search = searchParams.toString();
          navigate(userId ? `/users/${userId}${search}` : `/users${search}`);
        }
      } catch {
        // Error handling is managed globally by QueryProvider
      } finally {
        setSubmitting(false);
        submitActionRef.current = null;
      }
    },
  });

  const handleSaveAndClose = () => {
    submitActionRef.current = 'close';
    formik.submitForm();
  };

  const handleSaveAndView = () => {
    submitActionRef.current = 'view';
    formik.submitForm();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isMutationPending =
    addUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Card>
      <Card.Body>
        {isDuplicate && (
          <Alert variant="warning" className="mb-3">
            <i className="bx bx-error-alt me-2 align-middle"></i>
            {t('warning_duplicating_user')}
          </Alert>
        )}
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input
              formik={formik}
              fieldId={'first_name'}
              label={t('First Name')}
            />
            <Input
              formik={formik}
              fieldId={'last_name'}
              label={t('Last Name')}
            />
            <Input formik={formik} fieldId={'email'} label={t('Email')} />
            <Input
              formik={formik}
              fieldId={'phone_number'}
              label={t('Phone Number')}
            />
          </Row>

          <FormActionButtons
            isSubmitting={formik.isSubmitting}
            isPending={isMutationPending}
            isEdit={isEdit}
            isValid={formik.isValid}
            dirty={formik.dirty}
            onCancel={handleCancel}
            onSaveAndClose={handleSaveAndClose}
            onSaveAndView={handleSaveAndView}
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(UsersForm);
