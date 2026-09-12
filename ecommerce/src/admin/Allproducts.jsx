import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebarmenu from "./component/Sidebarmenu";
import ReuseDataTable from "./component/reactdatatable";
import Searchbar from "./component/searchbar";

import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Layers3,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  useGetAllProductsQuery,
  useDeleteSingleProductMutation,
  useDeleteMultipleProductMutation,
} from "../app/apiproducts";

import { backendurl } from "../baseurl/baseurl";

function Allproducts() {
  const [prodata, stateprodata] = useState([]);
  const [searchpro, statesearchpro] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);

  const { data, refetch } = useGetAllProductsQuery(searchpro);

  const [removeprod] = useDeleteSingleProductMutation();
  const [removemultipleprod] = useDeleteMultipleProductMutation();

  useEffect(() => {
    stateprodata(data || []);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id);

      if (result) {
        refetch();
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete product");
    }
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount);
  };

  const handlemultiitemDelete = async () => {
    try {
      if (selectedRows.length === 0) {
        toast.error("No product selected");
        return;
      }

      const ids = selectedRows.map((row) => row._id);

      const result = await removemultipleprod(ids);

      if (result) {
        if (result.data !== "no item selected") {
          toast.success(result.data);

          refetch();

          setSelectedRows([]);
          setSelectedItems(0);
        } else {
          toast.error(result.data);
        }
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      toast.error("Unable to delete products");
    }
  };

  const columns = [
    {
      name: "PRODUCT",
      selector: (row) => row.productname,
      sortable: true,
      grow: 1.6,
      cell: (row) => (
        <div className="product-table-name">
          <div className="product-table-image">
            <img
              src={`${backendurl}/uploads/${row.productimage}`}
              alt={row.productname || "Product"}
            />
          </div>

          <div className="product-table-info">
            <strong>{row.productname}</strong>
            <span>Product</span>
          </div>
        </div>
      ),
    },

    {
      name: "CATEGORY",
      selector: (row) => row.productcat,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <span className="product-category-badge">
          <Layers3 size={13} />
          {row.productcat}
        </span>
      ),
    },

    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="product-action-buttons">
          <Link
            to={`/allproducts/${row._id}`}
            className="product-action-btn product-edit-btn"
            title="Edit product"
          >
            <Pencil size={15} />
          </Link>

          <button
            type="button"
            className="product-action-btn product-delete-btn"
            onClick={() => handleDelete(row._id)}
            title="Delete product"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="products-page">
      <Sidebarmenu />

      <main className="products-main">
        {/* Page Header */}
        <header className="products-header">
          <div className="products-heading">
            <div className="products-heading-icon">
              <Package size={24} strokeWidth={2} />
            </div>

            <div>
              <span className="products-eyebrow">
                INVENTORY MANAGEMENT
              </span>

              <h1>All Products</h1>

              <p>
                Manage your store products, categories and inventory.
              </p>
            </div>
          </div>

          <Link to="/addproduct" className="add-product-btn">
            <Plus size={17} />
            Add Product
          </Link>
        </header>

        {/* Stats */}
        <section className="products-stats">
          <div className="product-stat-card">
            <div className="product-stat-icon blue">
              <Package size={19} />
            </div>

            <div>
              <span>Total Products</span>
              <strong>{prodata.length}</strong>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon green">
              <Layers3 size={19} />
            </div>

            <div>
              <span>Catalog</span>
              <strong>Products</strong>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon purple">
              <Package size={19} />
            </div>

            <div>
              <span>Management</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>

        {/* Search / Toolbar */}
        <section className="products-toolbar">
          <div className="products-toolbar-title">
            <div className="products-toolbar-icon">
              <Package size={17} />
            </div>

            <div>
              <strong>Product Directory</strong>
              <span>Search and manage your products</span>
            </div>
          </div>

          <div className="products-search">
            <Searchbar
              statesearchpro={statesearchpro}
              placeholder="Search products..."
            />
          </div>
        </section>

        {/* Selected Products */}
        {selectedItems > 0 && (
          <div className="selected-products-toolbar">
            <div className="selected-products-info">
              <div className="selected-products-count">
                {selectedItems}
              </div>

              <div>
                <strong>Products selected</strong>
                <span>
                  Selected products are ready for deletion
                </span>
              </div>
            </div>

            <button
              type="button"
              className="delete-selected-products"
              onClick={handlemultiitemDelete}
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        )}

        {/* Products Table */}
        <section className="products-table-card">
          <div className="products-table-header">
            <div>
              <span>PRODUCT CATALOG</span>
              <h2>All Products</h2>
            </div>

            <div className="products-table-status">
              <span></span>
              Catalog Active
            </div>
          </div>

          <div className="products-table-wrapper">
            <ReuseDataTable
              data={prodata}
              columns={columns}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Allproducts;

