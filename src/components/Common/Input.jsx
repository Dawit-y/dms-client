import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Input = ({
  type = 'text',
  fieldId,
  formik,
  label,
  onChange,
  placeholder,
  maxLength = 200,
  className,
  isRequired = true,
  rows = 3,
  cols,
}) => {
  const { t } = useTranslation();

  const touched = formik.touched[fieldId];
  const error = formik.errors[fieldId];
  const value = formik.values[fieldId] || '';

  const isTextarea = type === 'textarea';

  return (
    <Col className={className ?? 'col-md-4 mb-3'}>
      <Form.Group controlId={fieldId}>
        <Form.Label>
          {label || t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          as={isTextarea ? 'textarea' : 'input'}
          type={isTextarea ? undefined : type}
          name={fieldId}
          placeholder={placeholder ?? label ?? t(fieldId)}
          onChange={onChange ?? formik.handleChange}
          onBlur={formik.handleBlur}
          value={value}
          isInvalid={touched && !!error}
          maxLength={maxLength}
          rows={isTextarea ? rows : undefined}
          cols={isTextarea ? cols : undefined}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'textarea']),
  fieldId: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export default Input;
