import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useAddProject, useUpdateProject } from '../../queries/projects_query';

const ProjectsForm = ({ isEdit = false, rowData = {} }) => {
  const submitActionRef = useRef(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const addProjectMutation = useAddProject();
  const updateProjectMutation = useUpdateProject();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('field_required')),
    budget: Yup.number().required(t('field_required')),
    status: Yup.string().required(t('field_required')),
    isApproved: Yup.boolean(),
    description: Yup.string().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      title: isEdit ? rowData.title || '' : '',
      budget: isEdit ? rowData.budget || '' : '',
      status: isEdit ? rowData.status || '' : '',
      isApproved: isEdit ? !!rowData.isApproved : false,
      description: isEdit ? rowData.description || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        let projectId;

        if (isEdit) {
          await updateProjectMutation.mutateAsync({
            id: id || rowData.id,
            ...values,
          });
          projectId = id || rowData.id;
        } else {
          const result = await addProjectMutation.mutateAsync(values);
          projectId = result?.id;
        }

        if (submitActionRef.current === 'close') {
          navigate('/projects');
        }

        if (submitActionRef.current === 'view') {
          navigate(projectId ? `/projects/${projectId}` : '/projects');
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

  // Handle Cancel
  const handleCancel = () => {
    navigate('/projects');
  };

  // Check if any mutation is pending
  const isMutationPending =
    addProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input formik={formik} fieldId={'title'} />
            <NumberField formik={formik} fieldId={'budget'} />
            <Input type="checkbox" formik={formik} fieldId={'isApproved'} />
            <AsyncSelectField
              formik={formik}
              fieldId={'status'}
              optionMap={{
                active: t('Active'),
                inactive: t('Inactive'),
                completed: t('Completed'),
              }}
            />
            <Input
              className="col-md-12"
              formik={formik}
              fieldId={'description'}
              type="textarea"
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
            showSaveAndView
            showSaveAndClose
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(ProjectsForm);
