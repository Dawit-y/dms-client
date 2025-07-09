import { useFormik } from 'formik';
import { memo } from 'react';
import { Modal, Button, Form, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useAddProject, useUpdateProject } from '../../queries/projects_query';

const ProjectsForm = ({ isOpen, toggle, isEdit = false, rowData = {} }) => {
  const { t } = useTranslation();

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
      toggle();
      setSubmitting(false);
    },
  });

  return (
    <>
      <Modal show={isOpen} onHide={toggle} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Project' : 'Add Project'}</Modal.Title>
        </Modal.Header>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggle}>
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
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default memo(ProjectsForm);
