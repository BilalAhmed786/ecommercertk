import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Trash2,
  ShoppingBag,
  Search,
  RefreshCw,
  PackageCheck,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebarmenu from "./component/Sidebarmenu";
import ReuseDataTable from "../admin/component/reactdatatable";
import Searchbar from "../admin/component/searchbar";

import {
  useAllOrdersforclientQuery,
  useDeleteSingleOrderclientMutation,
  useDeleteMultipleOrderclientMutation,
} from "../app/apiorders";


function Clientorders(props) {
  const email = props.useremail;

  const [search, statesearchpro] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, isFetching, refetch } =
    useAllOrdersforclientQuery({
      search,
      email,
    });

  const [removemultipleorders, { isLoading: isDeletingMultiple }] =
    useDeleteMultipleOrderclientMutation();

  const [removeorder, { isLoading: isDeleting }] =
    useDeleteSingleOrderclientMutation();

  const prodata = data?.orders || [];

  const handleDelete = async (id) => {
    try {
      const result = await removeorder(id);

      if (result.data) {
        toast.success(result.data);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Unable to delete order.");
    }
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  const handleMultiItemDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one order.");
      return;
    }

    try {
      const ids = selectedRows.map((row) => row._id);

      const result = await removemultipleorders(ids);

      if (result.data === "no item selected") {
        toast.error(result.data);
        return;
      }

      if (result.data) {
        toast.success(result.data);
        setSelectedRows([]);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      toast.error("Unable to delete selected orders.");
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "client-order-status delivered";

      case "confirmed":
      case "processing":
        return "client-order-status confirmed";

      case "pending":
        return "client-order-status pending";

      case "cancelled":
      case "canceled":
        return "client-order-status cancelled";

      default:
        return "client-order-status default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return <CheckCircle2 size={14} />;

      case "confirmed":
      case "processing":
        return <PackageCheck size={14} />;

      case "pending":
        return <Clock3 size={14} />;

      case "cancelled":
      case "canceled":
        return <XCircle size={14} />;

      default:
        return <PackageCheck size={14} />;
    }
  };

  const columns = [
    {
      name: "Customer",
      selector: (row) => row.name,
      sortable: true,
      grow: 1.4,
      cell: (row) => (
        <div className="client-order-customer">
          <div className="client-order-avatar">
            {row.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="client-order-customer-info">
            <strong>{row.name || "N/A"}</strong>
            <span>{row.email || "No email"}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <span className={getStatusClass(row.status)}>
          {getStatusIcon(row.status)}
          {row.status || "Unknown"}
        </span>
      ),
    },
    {
      name: "Order Date",
      selector: (row) => row.timestamp,
      sortable: true,
      grow: 1.3,
      cell: (row) => (
        <div className="client-order-date">
          <Clock3 size={15} />
          <span>{row.timestamp || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "Actions",
      grow: 0.8,
      cell: (row) => (
        <div className="client-order-actions">
          <Link
            to={`/clientorders/${row._id}`}
            className="client-order-view"
            title="View order"
          >
            <Eye size={17} />
          </Link>

          <button
            type="button"
            className="client-order-delete"
            onClick={() => handleDelete(row._id)}
            disabled={isDeleting}
            title="Delete order"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="client-orders-page">
        {/* Header */}
        <div className="client-orders-header">
          <div className="client-orders-heading">
            <div className="client-orders-title-icon">
              <ShoppingBag size={24} />
            </div>

            <div>
              <div className="client-orders-title-row">
                <h1>My Orders</h1>

                <span className="client-orders-count">
                  {prodata.length}{" "}
                  {prodata.length === 1 ? "Order" : "Orders"}
                </span>
              </div>

              <p>
                View, track and manage your recent orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="client-orders-refresh"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh orders"
          >
            <RefreshCw
              size={17}
              className={isFetching ? "refresh-spinning" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="client-order-stats">
          <div className="client-order-stat-card">
            <div className="client-stat-icon total">
              <ShoppingBag size={20} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{prodata.length}</strong>
            </div>
          </div>

          <div className="client-order-stat-card">
            <div className="client-stat-icon pending">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {
                  prodata.filter(
                    (order) => order.status?.toLowerCase() === "pending"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="client-order-stat-card">
            <div className="client-stat-icon confirmed">
              <PackageCheck size={20} />
            </div>

            <div>
              <span>Processing</span>
              <strong>
                {
                  prodata.filter(
                    (order) =>
                      order.status?.toLowerCase() === "processing" ||
                      order.status?.toLowerCase() === "confirmed"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="client-order-stat-card">
            <div className="client-stat-icon delivered">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Delivered</span>
              <strong>
                {
                  prodata.filter(
                    (order) =>
                      order.status?.toLowerCase() === "delivered" ||
                      order.status?.toLowerCase() === "completed"
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="client-orders-toolbar">
          <div className="client-orders-search">
            <Search size={18} />
            <Searchbar statesearchpro={statesearchpro} />
          </div>

          {selectedRows.length > 0 && (
            <button
              type="button"
              className="client-delete-selected"
              onClick={handleMultiItemDelete}
              disabled={isDeletingMultiple}
            >
              <Trash2 size={16} />
              {isDeletingMultiple
                ? "Deleting..."
                : `Delete Selected (${selectedRows.length})`}
            </button>
          )}
        </div>

        {/* Table */}
        <section className="client-orders-table-card">
          <div className="client-orders-table-header">
            <div>
              <h2>Order History</h2>
              <p>Your recent purchases and their current status.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="client-orders-loading">
              <RefreshCw size={25} className="refresh-spinning" />
              <span>Loading your orders...</span>
            </div>
          ) : prodata.length > 0 ? (
            <ReuseDataTable
              data={prodata}
              columns={columns}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
            />
          ) : (
            <div className="client-orders-empty">
              <div className="empty-order-icon">
                <ShoppingBag size={30} />
              </div>

              <h3>No orders found</h3>

              <p>
                You don't have any orders matching your search.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Clientorders;
