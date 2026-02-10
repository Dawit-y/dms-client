import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';

import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import { useAddUser, useUpdateUser } from '../../queries/users_query';

const UsersForm = ({ isEdit = false, rowData = {} }) => {
  const submitActionRef = useRef(null);
  const { t } = useTranslation();
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
      first_name: isEdit ? rowData.first_name || '' : '',
      last_name: isEdit ? rowData.last_name || '' : '',
      email: isEdit ? rowData.email || '' : '',
      phone_number: isEdit ? rowData.phone_number || '' : '',
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
          navigate('/users');
        }

        if (submitActionRef.current === 'view') {
          navigate(userId ? `/users/${userId}` : '/users');
        }
      } catch (error) {
        console.error(error);
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
    navigate('/users');
  };

  const isMutationPending =
    addUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Card>
      <Card.Body>
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
