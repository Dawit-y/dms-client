import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
} from 'reactstrap';
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
    <Modal size="lg" isOpen={isOpen} toggle={toggle}>
      <ModalHeader className="bg-primary text-white" toggle={toggle}>
        {isEdit ? 'Edit Document' : 'Add Document'}
      </ModalHeader>
      <Form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <FormGroup tag={Col}>
            <Label for="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.title && !!formik.errors.title}
              placeholder="Enter title"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="invalid-feedback d-block">
                {formik.errors.title}
              </div>
            )}
          </FormGroup>

          <FormGroup tag={Col}>
            <Label for="type">Type</Label>
            <Input
              id="type"
              name="type"
              type="select"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.type && !!formik.errors.type}
            >
              <option value="">Select type</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
            </Input>
            {formik.touched.type && formik.errors.type && (
              <div className="invalid-feedback d-block">
                {formik.errors.type}
              </div>
            )}
          </FormGroup>

          <FormGroup tag={Col}>
            <Label for="uploadedBy">Uploaded By</Label>
            <Input
              id="uploadedBy"
              name="uploadedBy"
              type="text"
              value={formik.values.uploadedBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.uploadedBy && !!formik.errors.uploadedBy}
              placeholder="Uploader name"
            />
            {formik.touched.uploadedBy && formik.errors.uploadedBy && (
              <div className="invalid-feedback d-block">
                {formik.errors.uploadedBy}
              </div>
            )}
          </FormGroup>

          <FormGroup tag={Col}>
            <Label for="uploadedAt">Uploaded At</Label>
            <Input
              id="uploadedAt"
              name="uploadedAt"
              type="date"
              value={formik.values.uploadedAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.uploadedAt && !!formik.errors.uploadedAt}
            />
            {formik.touched.uploadedAt && formik.errors.uploadedAt && (
              <div className="invalid-feedback d-block">
                {formik.errors.uploadedAt}
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={formik.isSubmitting}>
            {isEdit ? 'Update Document' : 'Add Document'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DocumentsForm;
