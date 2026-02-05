import { useFormik } from 'formik';
import { memo } from 'react';
import { Button, Form, Row, Spinner, Card, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useAddProject, useUpdateProject } from '../../queries/projects_query';

const ProjectsForm = ({ isEdit = false, rowData = {} }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const addProjectMutation = useAddProject();
  const updateProjectMutation = useUpdateProject();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('field_required')),
    budget: Yup.number().required(t('field_required')),
    status: Yup.string().required(t('field_required')),
    isApproved: Yup.boolean().required(t('field_required')),
    description: Yup.string().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      title: isEdit ? rowData.title || '' : '',
      budget: isEdit ? rowData.budget || '' : '',
      status: isEdit ? rowData.status || '' : '',
      isApproved: isEdit ? rowData.isApproved || false : false,
      description: isEdit ? rowData.description || '' : '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const action = isEdit
        ? updateProjectMutation.mutateAsync({ id: rowData?.id, ...values })
        : addProjectMutation.mutateAsync(values);

      await action;
      setSubmitting(false);
      navigate('/projects');
    },
  });

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
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={
                formik.isSubmitting ||
                addProjectMutation.isPending ||
                updateProjectMutation.isPending
              }
            >
              {(addProjectMutation.isPending ||
                updateProjectMutation.isPending) && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              {isEdit ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(ProjectsForm);
