import { useTranslation } from 'react-i18next';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useChildProjectColumns = (
  onEdit,
  onDelete,
  handleCanvasToggle,
  hasPermission
) => {
  const { t } = useTranslation();
  return [
    snColumn,
    {
      accessorKey: 'title',
      header: t('title'),
    },
    {
      accessorKey: 'budget',
      header: t('budget'),
      cell: (info) => {
        const value = info.getValue();
        return value ? `$${Number(value).toLocaleString()}` : '-';
      },
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: (info) => {
        const value = info.getValue();
        return value || '-';
      },
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onCanvasToggle={() => handleCanvasToggle(info.row.original)}
          onEdit={
            hasPermission('accounts.change_project')
              ? () => onEdit(info.row.original)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_project')
              ? () => onDelete(info.row.original)
              : undefined
          }
        />
      ),
    },
  ];
};
