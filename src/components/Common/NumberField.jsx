import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const formatNumber = (value, allowDecimal) => {
  if (value === undefined || value === null || value === '') return '';

  const number = parseFloat(value);
  if (isNaN(number)) return '';

  return allowDecimal
    ? number.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : number.toLocaleString();
};

const NumberField = ({
  formik,
  fieldId,
  label,
  isRequired = true,
  allowDecimal = false,
  className = 'col-md-4 mb-3',
  infoText,
}) => {
  const { t } = useTranslation();
  const rawValue = formik.values[fieldId];

  const [displayValue, setDisplayValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const valueToShow = isEditing
    ? displayValue
    : formatNumber(rawValue, allowDecimal);

  const handleChange = (e) => {
    setIsEditing(true);

    const input = e.target.value.replace(/,/g, '');
    const regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;

    if (!regex.test(input)) return;

    formik.setFieldValue(fieldId, input);
    setDisplayValue(e.target.value);
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    setDisplayValue('');
    formik.handleBlur(e);
  };

  return (
    <Col className={className}>
      <Form.Group controlId={fieldId}>
        <Form.Label>
          {label || t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>

        <Form.Control
          type="text"
          placeholder={t(fieldId)}
          name={fieldId}
          value={valueToShow}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={formik.touched[fieldId] && !!formik.errors[fieldId]}
        />

        <Form.Control.Feedback type="invalid">
          {formik.errors[fieldId]}
        </Form.Control.Feedback>

        {infoText && <Form.Text className="text-muted">{infoText}</Form.Text>}
      </Form.Group>
    </Col>
  );
};

NumberField.propTypes = {
  formik: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  fieldId: PropTypes.string.isRequired,
  allowDecimal: PropTypes.bool,
  className: PropTypes.string,
  infoText: PropTypes.string,
};

export default NumberField;
