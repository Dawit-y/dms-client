import { FaEye } from 'react-icons/fa';

import IconButton from '../../components/Common/IconButton';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

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
  {
    header: 'Actions',
    id: 'actions',
    cell: (info) => (
      <IconButton
        icon={<FaEye />}
        onClick={() => navigate(`/projects/${info.row.original.id}`)}
      />
    ),
  },
];
