import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * AsyncSelectField renders a select input based on a key-value map.
 * The map is expected in the format: { [value]: label, ... }
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.fieldId - Form field name.
 * @param {Object} props.formik - Formik-like formik object.
 * @param {boolean} [props.isRequired=false] - Show asterisk on the label if true.
 * @param {string} [props.className] - Optional class for layout.
 * @param {Object.<string|number, string>} props.optionMap - Map of value-label pairs.
 * @param {boolean} [props.isLoading=false] - Show loading placeholder.
 * @param {boolean} [props.isError=false] - Show error placeholder.
 *
 * @returns {JSX.Element}
 */
const AsyncSelectField = ({
  fieldId,
  formik,
  isRequired = true,
  className = 'col-md-4 mb-3',
  label,
  optionMap = {},
  isLoading = false,
  isError = false,
}) => {
  const { t } = useTranslation();
  const controlId = `${fieldId}-control`;

  const touched = formik?.touched?.[fieldId];
  const error = formik?.errors?.[fieldId];
  const value = formik?.values?.[fieldId] || '';

  return (
    <Col className={className}>
      <Form.Group controlId={controlId}>
        <Form.Label>
          {label ?? t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>

        <Form.Select
          name={fieldId}
          value={value}
          onChange={formik?.handleChange}
          onBlur={formik?.handleBlur}
          isInvalid={touched && !!error}
          disabled={isLoading || isError}
        >
          {isLoading ? (
            <option value="">{t('Loading')}...</option>
          ) : isError ? (
            <option value="">{t('Failed to load options')}</option>
          ) : (
            <>
              <option value="">
                {t('Select')} {label ?? t(fieldId)}
              </option>
              {Object.entries(optionMap).map(([optValue, optLabel]) => (
                <option key={optValue} value={optValue}>
                  {t(optLabel)}
                </option>
              ))}
            </>
          )}
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {touched && error ? error : ''}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};

AsyncSelectField.propTypes = {
  fieldId: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  optionMap: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};

export default AsyncSelectField;
