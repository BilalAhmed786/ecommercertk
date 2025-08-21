import DataTable from 'react-data-table-component';

const ReuseDataTable = ({
  data,
  columns,
  selectedRows,
  onRowSelected,
  pagination = true
}) => {
  return (
    <div className="user-data-table">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        highlightOnHover
        selectableRows
        selectableRowsHighlight
        selectableRowsSelected={selectedRows}
        onSelectedRowsChange={onRowSelected}
      />
    </div>
  );
};

export default ReuseDataTable;
