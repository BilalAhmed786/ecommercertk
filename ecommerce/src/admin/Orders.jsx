import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  Eye,
  PackageCheck,
  Clock3,
  XCircle,
  Receipt,
  Search,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebarmenu from "./component/Sidebarmenu";
import ReuseDataTable from "./component/reactdatatable";
import Searchbar from "./component/searchbar";

import {
  useAllOrdersforadminQuery,
  useDeleteSingleOrderMutation,
  useDeleteMultipleOrderadminMutation,
} from "../app/apiorders";

function Orders() {
  const [prodata, setProdata] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);

  const {
    data,
    isLoading,
    refetch,
  } = useAllOrdersforadminQuery(search);

  const [removeorder, { isLoading: isDeleting }] =
    useDeleteSingleOrderMutation();

  const [removemultipleorders, { isLoading: isDeletingMultiple }] =
    useDeleteMultipleOrderadminMutation();

  useEffect(() => {
    setProdata(data?.orders || []);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      const result = await removeorder(id);

      if (result?.data) {
        toast.success(result.data);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Unable to delete order");
    }
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount);
  };

  const handleMultiItemDelete = async () => {
    if (!selectedRows.length) {
      toast.error("Please select at least one order");
      return;
    }

    try {
      const ids = selectedRows.map((row) => row._id);

      const result = await removemultipleorders(ids);

      if (result?.data) {
        if (result.data !== "no item selected") {
          toast.success(result.data);

          setSelectedRows([]);
          setSelectedItems(0);

          refetch();
        } else {
          toast.error(result.data);
        }
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      toast.error("Unable to delete selected orders");
    }
  };

  const totalOrders = prodata.length;

  const pendingOrders = prodata.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  const completedOrders = prodata.filter((order) => {
    const status = order.status?.toLowerCase();

    return (
      status === "completed" ||
      status === "delivered" ||
      status === "confirmed"
    );
  }).length;

  const cancelledOrders = prodata.filter(
    (order) => order.status?.toLowerCase() === "cancelled"
  ).length;

  const OrderStatus = ({ status }) => {
    const normalizedStatus = status?.toLowerCase();

    let className = "orders-status-badge";

    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "delivered" ||
      normalizedStatus === "confirmed"
    ) {
      className += " success";
    } else if (normalizedStatus === "pending") {
      className += " pending";
    } else if (normalizedStatus === "cancelled") {
      className += " cancelled";
    } else {
      className += " default";
    }

    return (
      <span className={className}>
        <span className="orders-status-dot" />
        {status || "Unknown"}
      </span>
    );
  };

  const columns = [
  {
    name: "Customer",
    selector: (row) => row.name,
    sortable: true,
    grow: 1.5,
    cell: (row) => (
      <div className="order-customer">
        <div className="order-customer-avatar">
          {row.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="order-customer-info">
          <span className="order-customer-name">
            {row.name || "Unknown"}
          </span>

          <span className="order-customer-label">
            Customer
          </span>
        </div>
      </div>
    ),
  },

  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    grow: 1.8,
    cell: (row) => (
      <span className="order-email">
        {row.email || "N/A"}
      </span>
    ),
  },

  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    grow: 1,
    cell: (row) => (
      <OrderStatus status={row.status} />
    ),
  },

  {
    name: "Order Date",
    selector: (row) => row.timestamp,
    sortable: true,
    grow: 1.3,
    cell: (row) => (
      <div className="order-date">
        <Receipt size={15} />
        <span>{row.timestamp || "N/A"}</span>
      </div>
    ),
  },

  {
    name: "Actions",
    grow: 0.7,
    cell: (row) => (
      <div className="order-action-buttons">
        <Link
          to={`/orders/${row._id}`}
          className="order-view-btn"
          title="View order"
        >
          <Eye size={17} />
        </Link>

        <button
          type="button"
          className="order-delete-btn"
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
    <div className="orders-page">
      <Sidebarmenu />

      <main className="orders-main">
        <div className="orders-header">
          <div>
            <div className="orders-breadcrumb">
              Dashboard
              <ChevronRight size={14} />
              Orders
            </div>

            <div className="orders-title-row">
              <div className="orders-title-icon">
                <ShoppingBag size={24} />
              </div>

              <div>
                <h1>Orders</h1>
                <p>Manage and monitor customer orders</p>
              </div>
            </div>
          </div>

          <div className="orders-header-badge">
            <ShoppingBag size={16} />
            {totalOrders} Orders
          </div>
        </div>

        <div className="orders-stats-grid">
          <div className="orders-stat-card">
            <div className="orders-stat-icon blue">
              <ShoppingBag size={21} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{totalOrders}</strong>
            </div>
          </div>

          <div className="orders-stat-card">
            <div className="orders-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingOrders}</strong>
            </div>
          </div>

          <div className="orders-stat-card">
            <div className="orders-stat-icon green">
              <PackageCheck size={21} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedOrders}</strong>
            </div>
          </div>

          <div className="orders-stat-card">
            <div className="orders-stat-icon red">
              <XCircle size={21} />
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{cancelledOrders}</strong>
            </div>
          </div>
        </div>

        <div className="orders-search-card">
          <div className="orders-search-heading">
            <div className="orders-search-icon">
              <Search size={19} />
            </div>

            <div>
              <h3>Find Orders</h3>
              <p>Search through your customer orders</p>
            </div>
          </div>

          <div className="orders-search-wrapper">
            <Searchbar statesearchpro={setSearch} />
          </div>
        </div>

        {prodata.length > 0 && (
          <div className="orders-bulk-toolbar">
            <div className="orders-selected-info">
              <div className="orders-selected-icon">
                <ShoppingBag size={17} />
              </div>

              <div>
                <strong>{selectedItems} selected</strong>
                <span>
                  Select orders from the table to perform bulk actions
                </span>
              </div>
            </div>

            <button
              type="button"
              className="orders-delete-selected"
              onClick={handleMultiItemDelete}
              disabled={selectedItems === 0 || isDeletingMultiple}
            >
              <Trash2 size={17} />

              {isDeletingMultiple
                ? "Deleting..."
                : "Delete Selected"}
            </button>
          </div>
        )}

        <section className="orders-table-card">
          <div className="orders-table-header">
            <div>
              <div className="orders-table-title">
                <ShoppingBag size={18} />
                <h2>All Orders</h2>
              </div>

              <p>View, manage and track all customer orders</p>
            </div>

            <span className="orders-table-count">
              {totalOrders} records
            </span>
          </div>

          <div className="orders-table-wrapper">
            <ReuseDataTable
              data={prodata}
              columns={columns}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
              progressPending={isLoading}
              pagination
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Orders;
