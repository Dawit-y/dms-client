import { useFormik } from 'formik';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import FileUploader from '../../components/Common/FileUploader';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';

const UsersForm = ({ isOpen, toggle, isEdit = false, rowData = {} }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t('field_required')),
    lastName: Yup.string().required(t('field_required')),
    age: Yup.number().required(t('field_required')),
    visits: Yup.number().required(t('field_required')),
    status: Yup.string().required(t('field_required')),
  });
  const formik = useFormik({
    initialValues: {
      firstName: isEdit ? rowData.firstName || '' : '',
      lastName: isEdit ? rowData.lastName || '' : '',
      age: isEdit ? rowData.age || '' : '',
      visits: isEdit ? rowData.visits || '' : '',
      status: isEdit ? rowData.status || '' : '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(isEdit ? 'Update:' : 'Create:', values);
      toggle();
    },
    enableReinitialize: true,
  });

  return (
    <Modal show={isOpen} onHide={toggle} size="xl" centered>
      <Modal.Header closeButton className="">
        <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Row>
            <Input formik={formik} fieldId={'firstName'} />
            <Input formik={formik} fieldId={'lastName'} />
            <NumberField formik={formik} fieldId={'age'} />
            <NumberField formik={formik} fieldId={'visits'} />
            <AsyncSelectField
              fieldId="status"
              validation={formik}
              label="Status"
              optionMap={{
                single: 'Single',
                complicated: 'Complicated',
                relationship: 'Relationship',
              }}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {isEdit ? 'Update User' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UsersForm;
