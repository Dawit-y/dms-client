import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FormActionButtons = ({
  isSubmitting,
  isPending,
  isEdit,
  isValid,
  dirty,
  onCancel,
  onSaveAndClose,
  onSaveAndView,
}) => {
  const { t } = useTranslation();
  const isLoading = isSubmitting || isPending;
  const isDisabled = isLoading || !isValid || !dirty;

  return (
    <div className="d-flex justify-content-end mt-3 gap-2">
      <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
        {t('Cancel')}
      </Button>

      <Button variant="primary" onClick={onSaveAndClose} disabled={isDisabled}>
        {isLoading && <Spinner size="sm" className="me-2" />}
        {isEdit ? t('Update & Close') : t('Save & Close')}
      </Button>

      <Button variant="success" onClick={onSaveAndView} disabled={isDisabled}>
        {isLoading && <Spinner size="sm" className="me-2" />}
        {isEdit ? t('Update & View') : t('Save & View')}
      </Button>
    </div>
  );
};

export default FormActionButtons;
