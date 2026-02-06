import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FormActionButtons = ({
  isSubmitting = false,
  isPending = false,
  isEdit = false,
  onCancel,
  onSaveAndClose,
  onSaveAndView,
  cancelLabel = 'Cancel',
  showSaveAndView = true,
  showSaveAndClose = true,
}) => {
  const { t } = useTranslation();
  const isLoading = isSubmitting || isPending;

  return (
    <div className="d-flex justify-content-end mt-3 gap-2">
      <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>

      {showSaveAndClose && (
        <Button variant="primary" onClick={onSaveAndClose} disabled={isLoading}>
          {isLoading && (
            <Spinner animation="border" size="sm" className="me-2" />
          )}
          {isEdit ? t('Update & Close') : t('Save & Close')}
        </Button>
      )}

      {showSaveAndView && (
        <Button variant="success" onClick={onSaveAndView} disabled={isLoading}>
          {isLoading && (
            <Spinner animation="border" size="sm" className="me-2" />
          )}
          {isEdit ? t('Update & View') : t('Save & View')}
        </Button>
      )}
    </div>
  );
};

export default FormActionButtons;
