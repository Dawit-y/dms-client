import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Type is required'),
  uploadedBy: Yup.string().required('Uploader name is required'),
  uploadedAt: Yup.date().required('Upload date is required'),
});

const DocumentsForm = ({ isOpen, toggle, isEdit = false, rowData = {} }) => {
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
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(isEdit ? 'Update:' : 'Create:', values);
      toggle();
    },
    enableReinitialize: true,
  });

  return (
    <Modal show={isOpen} onHide={toggle} size="lg" centered>
      <Modal.Header closeButton className="">
        <Modal.Title>{isEdit ? 'Edit Document' : 'Add Document'}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group as={Col} controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              placeholder="Enter title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.title && !!formik.errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="type" className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.type && !!formik.errors.type}
            >
              <option value="">Select type</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.type}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="uploadedBy" className="mb-3">
            <Form.Label>Uploaded By</Form.Label>
            <Form.Control
              name="uploadedBy"
              type="text"
              placeholder="Uploader name"
              value={formik.values.uploadedBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.uploadedBy && !!formik.errors.uploadedBy
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.uploadedBy}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="uploadedAt" className="mb-3">
            <Form.Label>Uploaded At</Form.Label>
            <Form.Control
              name="uploadedAt"
              type="date"
              value={formik.values.uploadedAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.uploadedAt && !!formik.errors.uploadedAt
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.uploadedAt}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            variant="primary"
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
