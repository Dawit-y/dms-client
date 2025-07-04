export const snColumn = {
  id: 'sn',
  header: 'S.N',
  cell: ({ row, table }) =>
    row.index +
    1 +
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize,
  enableSorting: false,
  enableColumnFilter: false,
  maxSize: 50,
};
