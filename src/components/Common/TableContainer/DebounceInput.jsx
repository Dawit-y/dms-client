import React from 'react';
import { Col, FormControl } from 'react-bootstrap';

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  globalFilter,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Col sm={globalFilter ? 4 : 12}>
      <FormControl
        size={globalFilter ? 'md' : 'sm'}
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Col>
  );
}

export default DebouncedInput;
