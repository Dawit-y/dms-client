import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import FileUploader from '../../components/Common/FileUploader';
import Input from '../../components/Common/Input';
import AsyncSelectField from '../../components/Common/AsyncSelectField';

const DocumentsForm = ({ isOpen, toggle, isEdit = false, rowData = {} }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('field_required')),
    type: Yup.string().required(t('field_required')),
    uploadedBy: Yup.string().required(t('field_required')),
    uploadedAt: Yup.date().required(t('field_required')),
    file: Yup.string().required(t('field_required')),
  });
  const formik = useFormik({
    initialValues: {
      title: isEdit ? rowData.title || '' : '',
      type: isEdit ? rowData.type || '' : '',
      uploadedBy: isEdit ? rowData.uploadedBy || '' : '',
      uploadedAt: isEdit
        ? rowData.uploadedAt?.slice(0, 10) ||
          new Date().toISOString().slice(0, 10)
        : '',
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
        <Modal.Title>{isEdit ? 'Edit Document' : 'Add Document'}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Row>
            <Input formik={formik} fieldId={'title'} />
            <Input formik={formik} fieldId={'uploadedBy'} />
            <Input formik={formik} fieldId={'uploadedAt'} />
            <AsyncSelectField
              fieldId="type"
              validation={formik}
              label="Type"
              optionMap={{
                PDF: 'PDF',
                DOCX: 'DOCX',
                XLSX: 'XLSX',
              }}
            />
          </Row>
          <Form.Group as={Col} controlId="file" className="mb-3">
            <Form.Label>File</Form.Label>
            <FileUploader />
            <Form.Control.Feedback type="invalid">
              {formik.errors.file}
            </Form.Control.Feedback>
          </Form.Group>
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
            {isEdit ? 'Update Document' : 'Add Document'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DocumentsForm;
