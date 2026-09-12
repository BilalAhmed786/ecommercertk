import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  SlidersHorizontal,
  DollarSign,
  Layers3,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetRangeQuery,
  useAddRangeMutation,
  useUpdateRangeMutation,
  useDeleteRangeMutation,
} from "../app/productfilter";

import ReuseDataTable from "../admin/component/reactdatatable";
import Sidebarmenu from "./component/Sidebarmenu";
import Searchbar from "./component/searchbar";

export default function PriceRangeManager() {
  const [range, setRange] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchitem, statesearchpro] = useState("");

  const {
    data: ranges = [],
    isLoading,
    refetch,
  } = useGetRangeQuery();

  const [addRange, { isLoading: isAdding }] = useAddRangeMutation();
  const [updateRange, { isLoading: isUpdating }] =
    useUpdateRangeMutation();
  const [deleteRange] = useDeleteRangeMutation();

  const isEditing = Boolean(editId);
  const isSaving = isAdding || isUpdating;

  /* --------------------------------
     Filter
  -------------------------------- */

  const filterdata = useMemo(() => {
    const search = searchitem.trim().toLowerCase();

    if (!search) return ranges;

    return ranges.filter((item) =>
      item.range?.toLowerCase().includes(search)
    );
  }, [ranges, searchitem]);

  /* --------------------------------
     Add / Update
  -------------------------------- */

  async function handleSubmit() {
    const cleanRange = range.trim();

    if (!/^\d+\s*-\s*\d+$/.test(cleanRange)) {
      toast.error("Enter a valid range like 0-50");
      return;
    }

    try {
      if (isEditing) {
        await updateRange({
          id: editId,
          range: cleanRange,
        }).unwrap();

        toast.success("Price range updated successfully.");

        setEditId(null);
      } else {
        await addRange({
          range: cleanRange,
        }).unwrap();

        toast.success("Price range added successfully.");
      }

      setRange("");
      refetch();
    } catch (error) {
      const message =
        error?.data ||
        error?.error ||
        `Unable to ${isEditing ? "update" : "add"} price range.`;

      toast.error(message);
    }
  }

  /* --------------------------------
     Edit
  -------------------------------- */

  function handleEdit(row) {
    setEditId(row._id);
    setRange(row.range);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* --------------------------------
     Cancel Edit
  -------------------------------- */

  function handleCancelEdit() {
    setEditId(null);
    setRange("");
  }

  /* --------------------------------
     Delete
  -------------------------------- */

  async function handleDelete(id) {
    try {
      await deleteRange(id).unwrap();

      toast.success("Price range deleted successfully.");
      refetch();
    } catch (error) {
      toast.error(
        error?.data ||
          error?.error ||
          "Unable to delete price range."
      );
    }
  }

  /* --------------------------------
     Delete Selected
  -------------------------------- */

  async function handleDeleteSelected() {
    if (!selectedRows.length) {
      toast.info("Please select at least one price range.");
      return;
    }

    try {
      await Promise.all(
        selectedRows.map((row) =>
          deleteRange(row._id).unwrap()
        )
      );

      toast.success(
        `${selectedRows.length} price range${
          selectedRows.length > 1 ? "s" : ""
        } deleted successfully.`
      );

      setSelectedRows([]);
      refetch();
    } catch (error) {
      toast.error(
        error?.data ||
          error?.error ||
          "Some price ranges could not be deleted."
      );

      refetch();
    }
  }

  /* --------------------------------
     Table Columns
  -------------------------------- */

  const columns = [
    {
      name: "PRICE RANGE",
      selector: (row) => row.range,
      sortable: true,
      cell: (row) => (
        <div className="price-range-value">
          <div className="range-icon">
            <DollarSign size={15} />
          </div>

          <div>
            <strong>Rs. {row.range}</strong>
            <span>Product price range</span>
          </div>
        </div>
      ),
      grow: 2,
    },
    {
      name: "STATUS",
      cell: () => (
        <span className="range-status">
          <CheckCircle2 size={14} />
          Active
        </span>
      ),
      width: "150px",
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="range-action-buttons">
          <button
            type="button"
            className="range-edit-btn"
            onClick={() => handleEdit(row)}
            title="Edit range"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="range-delete-btn"
            onClick={() => handleDelete(row._id)}
            title="Delete range"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="price-range-page">
      <Sidebarmenu />

      <main className="price-range-main">
        {/* =================================
            HEADER
        ================================= */}

        <header className="price-range-header">
          <div>
            <div className="price-range-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <strong>Price Management</strong>
            </div>

            <div className="price-range-title">
              <div className="price-range-title-icon">
                <SlidersHorizontal size={25} />
              </div>

              <div>
                <h1>Price Range Manager</h1>
                <p>
                  Create and manage price ranges used to filter
                  products.
                </p>
              </div>
            </div>
          </div>

          <div className="price-range-total-card">
            <div>
              <span>Total Ranges</span>
              <strong>{ranges.length}</strong>
            </div>

            <Layers3 size={24} />
          </div>
        </header>

        {/* =================================
            CONTENT
        ================================= */}

        <div className="price-range-content">
          {/* =================================
              ADD / EDIT CARD
          ================================= */}

          <section
            className={`price-range-form-card ${
              isEditing ? "editing" : ""
            }`}
          >
            <div className="price-range-form-header">
              <div
                className={`price-range-form-icon ${
                  isEditing ? "edit" : ""
                }`}
              >
                {isEditing ? (
                  <Pencil size={21} />
                ) : (
                  <Plus size={22} />
                )}
              </div>

              <div>
                <h2>
                  {isEditing
                    ? "Edit Price Range"
                    : "Add Price Range"}
                </h2>

                <p>
                  {isEditing
                    ? "Update the selected price range."
                    : "Create a new price range for your products."}
                </p>
              </div>
            </div>

            <div className="price-range-form-body">
              <div className="price-range-input-group">
                <label htmlFor="price-range">
                  Price Range
                  <span>*</span>
                </label>

                <div className="price-range-input-wrapper">
                  <DollarSign size={18} />

                  <input
                    id="price-range"
                    type="text"
                    value={range}
                    onChange={(event) =>
                      setRange(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    placeholder="0-50"
                  />

                  {range && (
                    <button
                      type="button"
                      className="clear-range-input"
                      onClick={() => setRange("")}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <small>
                  Example: <strong>0-50</strong>,{" "}
                  <strong>51-100</strong>,{" "}
                  <strong>101-500</strong>
                </small>
              </div>

              <div className="price-range-form-actions">
                <button
                  type="button"
                  className={`save-range-btn ${
                    isEditing ? "update" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="range-spinner" />
                      {isEditing
                        ? "Updating..."
                        : "Adding..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={18} />
                      )}

                      {isEditing ? "Update Range" : "Add Range"}
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    className="cancel-range-btn"
                    onClick={handleCancelEdit}
                  >
                    <X size={17} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* =================================
              SEARCH
          ================================= */}

          <section className="price-range-toolbar">
            <div className="price-range-search-title">
              <Search size={19} />

              <div>
                <h3>Price Ranges</h3>
                <span>
                  {filterdata.length}{" "}
                  {filterdata.length === 1
                    ? "range"
                    : "ranges"}{" "}
                  found
                </span>
              </div>
            </div>

            <div className="price-range-search">
              <Search size={17} />

              <Searchbar
                statesearchpro={statesearchpro}
              />
            </div>
          </section>

          {/* =================================
              SELECTED TOOLBAR
          ================================= */}

          <div
            className={`selected-range-toolbar ${
              selectedRows.length > 0 ? "active" : ""
            }`}
          >
            <div className="selected-range-info">
              <div className="selected-range-count">
                {selectedRows.length}
              </div>

              <div>
                <strong>
                  {selectedRows.length > 0
                    ? "Ranges selected"
                    : "Select ranges"}
                </strong>

                <span>
                  {selectedRows.length > 0
                    ? "You can delete the selected ranges."
                    : "Use the table checkboxes to select items."}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="delete-selected-range-btn"
              onClick={handleDeleteSelected}
              disabled={!selectedRows.length}
            >
              <Trash2 size={17} />
              Delete Selected
            </button>
          </div>

          {/* =================================
              TABLE
          ================================= */}

          <section className="price-range-table-card">
            <div className="price-range-table-header">
              <div>
                <h3>All Price Ranges</h3>
                <p>
                  Manage your existing product price filters.
                </p>
              </div>

              <div className="table-count-badge">
                {ranges.length} Total
              </div>
            </div>

            <div className="price-range-table">
              <ReuseDataTable
                data={filterdata}
                columns={columns}
                selectedRows={selectedRows}
                onRowSelected={(state) =>
                  setSelectedRows(state.selectedRows)
                }
                pagination
                progressPending={isLoading}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
