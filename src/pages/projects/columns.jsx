import { Button } from 'react-bootstrap';

import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
// import { truncateText } from '../../utils/commonMethods';

export const projectColumns = (navigate) => [
  snColumn,
  {
    accessorKey: 'title',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'budget',
    cell: (info) => info.getValue(),
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'status',
    cell: (info) => info.getValue(),
  },
  // {
  //   accessorKey: 'description',
  //   cell: (info) => truncateText(info.getValue(), 50) ?? '-',
  // },
  {
    header: 'Actions',
    id: 'actions',
    cell: (info) => (
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate(`/projects/${info.row.original.id}`)}
      >
        View
      </Button>
    ),
  },
];
