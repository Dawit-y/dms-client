import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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

  useEffect(() => {
    if (!isEditing) {
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
        const number = parseFloat(rawValue);
        if (!isNaN(number)) {
          setDisplayValue(
            allowDecimal
              ? number.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : number.toLocaleString()
          );
        } else {
          setDisplayValue('');
        }
      } else {
        setDisplayValue('');
      }
    }
  }, [rawValue, allowDecimal, isEditing]);

  const handleChange = (e) => {
    setIsEditing(true);

    let input = e.target.value.replace(/,/g, '');
    const regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;

    if (regex.test(input)) {
      const numeric = parseFloat(input);
      let newDisplayValue = input;

      if (input !== '') {
        if (!isNaN(numeric)) {
          newDisplayValue =
            allowDecimal && input.includes('.')
              ? numeric.toLocaleString(undefined, {
                  minimumFractionDigits: input.endsWith('.') ? 0 : 1,
                  maximumFractionDigits: 2,
                }) + (input.endsWith('.') ? '.' : '')
              : numeric.toLocaleString();
        }
      }

      formik.setFieldValue(fieldId, input);
      setDisplayValue(newDisplayValue);
    }
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    const numeric = parseFloat(rawValue);
    if (!isNaN(numeric)) {
      setDisplayValue(
        allowDecimal
          ? numeric.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          : numeric.toLocaleString()
      );
    } else {
      setDisplayValue('');
    }

    formik.handleBlur(e);
  };

  return (
    <Col className={className}>
      <Form.Group controlId={fieldId}>
        <Form.Label>
          {label ? label : t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={t(fieldId)}
          name={fieldId}
          value={displayValue}
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
