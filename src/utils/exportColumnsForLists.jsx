export const projectExportColumns = [
  { key: 'title', label: 'Title', width: 60 },
  {
    key: 'budget',
    label: 'Budget',
    format: (val) => (val != null ? Number(val).toLocaleString() : '0'),
    type: 'number',
  },
  { key: 'status', label: 'Status' },
];

export const userExportColumns = [
  { key: 'first_name', label: 'first_name' },
  { key: 'last_name', label: 'last_name' },
  { key: 'email', label: 'email' },
  { key: 'phone_number', label: 'phone_number' },
];

export const projectPaymentExportColumns = [
  {
    key: 'amount',
    label: 'amount',
    format: (val) => (val ? `$${Number(val).toLocaleString()}` : '-'),
    type: 'currency',
  },
  {
    key: 'payment_date',
    label: 'payment_date',
    format: (val) => (val ? new Date(val).toLocaleDateString() : '-'),
    type: 'date',
  },
  {
    key: 'payment_method',
    label: 'payment_method',
    format: (val) => val || '-',
  },
  {
    key: 'status',
    label: 'status',
    format: (val) => val || '-',
  },
  {
    key: 'receipt_number',
    label: 'receipt_number',
    format: (val) => val || '-',
  },
];
