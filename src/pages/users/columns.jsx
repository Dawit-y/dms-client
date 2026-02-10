import { FaEye } from 'react-icons/fa';

import IconButton from '../../components/Common/IconButton';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const userColumns = (navigate) => [
  snColumn,
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: (info) => (
      <div className="d-flex gap-2">
        <IconButton
          icon={<FaEye />}
          onClick={() => navigate(`/users/${info.row.original.id}`)}
        />
      </div>
    ),
  },
];
