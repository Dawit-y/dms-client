import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Form, Row, Modal, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useAddProject, useUpdateProject } from '../../queries/projects_query';

const ProjectChildFormModal = ({
  isOpen,
  toggle,
  isEdit = false,
  projectData = {},
}) => {
  const { t } = useTranslation();

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
      title: isEdit ? projectData.title || '' : '',
      budget: isEdit ? projectData.budget || '' : '',
      status: isEdit ? projectData.status || '' : '',
      isApproved: isEdit ? !!projectData.isApproved : false,
      description: isEdit ? projectData.description || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEdit) {
          await updateProjectMutation.mutateAsync({
            id: projectData.id,
            ...values,
          });
        } else {
          await addProjectMutation.mutateAsync(values);
        }
        resetForm();
        toggle();
      } catch (error) {
        console.error(error);
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
    addProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <Modal size="lg" show={isOpen} onHide={toggle} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit
            ? t('edit_project', { id: projectData.id })
            : t('add_sub_project')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input formik={formik} fieldId={'title'} label={t('title')} />
            <NumberField
              formik={formik}
              fieldId={'budget'}
              label={t('budget')}
            />
            <Input
              type="checkbox"
              formik={formik}
              fieldId={'isApproved'}
              label={t('is_approved')}
            />
            <AsyncSelectField
              formik={formik}
              fieldId={'status'}
              label={t('status')}
              optionMap={{
                active: t('active'),
                inactive: t('inactive'),
                completed: t('completed'),
              }}
            />
            <Input
              className="col-md-12"
              formik={formik}
              fieldId={'description'}
              type="textarea"
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
          {t('cancel')}
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
          {isEdit ? t('update') : t('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProjectChildFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  projectData: PropTypes.object,
};

export default ProjectChildFormModal;
