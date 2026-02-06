import { Form } from 'react-bootstrap';
import 'react-ethiopian-calendar/dist/index.css';
import { EtCalendar } from 'react-ethiopian-calendar';
import { useTranslation } from 'react-i18next';

import { parseDateString, toYMDDateString } from '../../utils/commonMethods';

// Handle Excel serial date conversion (to be removed after DB cleanup)
const parseExcelSerialDate = (serialDate) => {
  if (typeof serialDate !== 'number') return null;

  try {
    // Excel dates are number of days since January 1, 1900
    const excelEpoch = new Date(1900, 0, 1);
    // Subtract 2 because Excel incorrectly considers 1900 as a leap year
    const jsDate = new Date(
      excelEpoch.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000
    );
    return jsDate;
  } catch (error) {
    console.warn('Failed to parse Excel serial date:', serialDate, error);
    return null;
  }
};

// Enhanced date parser that handles both string dates and Excel serial numbers
const enhancedParseDate = (rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null;
  }

  if (typeof rawValue === 'number') {
    return parseExcelSerialDate(rawValue);
  }

  return parseDateString(rawValue);
};

function DatePicker({
  isRequired,
  validation,
  componentId,
  minDate,
  maxDate,
  label,
  disabled,
}) {
  const { t } = useTranslation();

  const rawValue = validation?.values?.[componentId] ?? '';
  const selectedDate = enhancedParseDate(rawValue);

  const hasError =
    validation?.touched?.[componentId] && validation?.errors?.[componentId];

  const handleDateChange = (date) => {
    if (!date) return;

    const formatted = toYMDDateString(date);
    validation?.setFieldValue(componentId, formatted, true);
  };

  const parsedMinDate = enhancedParseDate(minDate);
  const parsedMaxDate = enhancedParseDate(maxDate);

  return (
    <>
      <Form.Label>
        {label ? t(label) : t(componentId)}{' '}
        {isRequired && <span className="text-danger">*</span>}
      </Form.Label>

      <div className={hasError ? 'is-invalid' : ''}>
        <EtCalendar
          value={selectedDate}
          onChange={handleDateChange}
          onBlur={validation?.handleBlur}
          calendarType
          fullWidth
          minDate={parsedMinDate}
          maxDate={parsedMaxDate}
          disabled={disabled}
          inputStyle={
            hasError
              ? {
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#f46a6a',
                }
              : {}
          }
        />
      </div>

      {hasError && (
        <div className="text-danger small mt-1">
          {validation.errors[componentId]}
        </div>
      )}
    </>
  );
}

export default DatePicker;
