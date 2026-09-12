import React from "react";
import DataTable from "react-data-table-component";

const ReuseDataTable = ({
  data = [],
  columns = [],
  selectedRows = [],
  onRowSelected,
  pagination = true,
}) => {
  return (
    <div className="reuse-data-table">
      <div className="reuse-data-table-scroll">
        <DataTable
          columns={columns}
          data={data}
          pagination={pagination}
          selectableRows
          selectableRowsHighlight
          selectableRowsSelected={selectedRows}
          onSelectedRowsChange={onRowSelected}
          highlightOnHover
          persistTableHead
          noDataComponent={
            <div className="datatable-empty">
              <div className="datatable-empty-icon">📦</div>

              <h3>No records found</h3>

              <p>There are currently no records to display.</p>
            </div>
          }
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          customStyles={{
            table: {
              style: {
                width: "100%",
                minWidth: "900px",
              },
            },

            tableWrapper: {
              style: {
                width: "100%",
              },
            },

            headRow: {
              style: {
                minHeight: "58px",
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e5e7eb",
              },
            },

            headCells: {
              style: {
                paddingLeft: "22px",
                paddingRight: "22px",
                color: "#64748b",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              },
            },

            rows: {
              style: {
                minHeight: "76px",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #f1f5f9",
                color: "#334155",
                fontSize: "14px",
                lineHeight: "1.5",
              },

              highlightOnHoverStyle: {
                backgroundColor: "#f8faff",
                borderBottomColor: "#e2e8f0",
                cursor: "default",
              },
            },

            cells: {
              style: {
                paddingLeft: "22px",
                paddingRight: "22px",
                paddingTop: "12px",
                paddingBottom: "12px",
                color: "#334155",
                fontSize: "14px",
                lineHeight: "1.6",
              },
            },

            pagination: {
              style: {
                minHeight: "68px",
                paddingLeft: "22px",
                paddingRight: "22px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #edf0f4",
                color: "#64748b",
                fontSize: "13px",
              },

              pageButtonsStyle: {
                borderRadius: "8px",
                height: "36px",
                width: "36px",
                padding: "0",
                margin: "0 3px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#475569",
                fill: "#475569",
                cursor: "pointer",
                transition: "all 0.2s ease",

                "&:hover:not(:disabled)": {
                  backgroundColor: "#f1f5ff",
                  borderColor: "#c7d2fe",
                  color: "#4f46e5",
                  fill: "#4f46e5",
                },

                "&:disabled": {
                  cursor: "not-allowed",
                  opacity: 0.4,
                },

                "&:focus": {
                  outline: "none",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ReuseDataTable;