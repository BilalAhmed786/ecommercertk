import React, { useEffect, useState } from "react";
import {
  Star,
  Trash2,
  Eye,
  MessageSquare,
  CheckCircle2,
  Clock3,
  X,
  ShieldCheck,
  Users,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebarmenu from "./component/Sidebarmenu";
import ReuseDataTable from "./component/reactdatatable";
import Searchbar from "./component/searchbar";

import {
  useGetReviewsforadminQuery,
  useGetSingleReviewsforadminQuery,
  useDeletesinglereviewMutation,
  useDeletemultireviewsMutation,
  useUpdatereviewstatusMutation,
} from "../app/apiproducts";

function Productreviews() {
  const [prodata, setProdata] = useState([]);
  const [searchpro, setSearchpro] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [id, setSingleReviewId] = useState("");
  const [updatecommentstatus, setUpdateStatus] = useState("");
  const [reviewFormVisible, setReviewFormVisible] = useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useGetReviewsforadminQuery(searchpro);

  const {
    data: singleReview,
    isFetching: isSingleReviewLoading,
  } = useGetSingleReviewsforadminQuery(id, {
    skip: !id,
  });

  const [removeprod, { isLoading: isDeleting }] =
    useDeletesinglereviewMutation();

  const [removeMultipleProd, { isLoading: isDeletingMultiple }] =
    useDeletemultireviewsMutation();

  const [reviewUpdated, { isLoading: isUpdating }] =
    useUpdatereviewstatusMutation();

  /* =================================
     DATA
  ================================= */

  useEffect(() => {
    if (data) {
      setProdata(data.Reviews || []);
    }
  }, [data]);

  /* =================================
     STATS
  ================================= */

  const totalReviews = prodata.length;

  const approvedReviews = prodata.filter(
    (review) => review.status === "approved"
  ).length;

  const pendingReviews = prodata.filter(
    (review) => review.status === "pending"
  ).length;

  const averageRating =
    totalReviews > 0
      ? (
          prodata.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  /* =================================
     DELETE SINGLE
  ================================= */

  const handleDelete = async (reviewId) => {
    try {
      const result = await removeprod(reviewId).unwrap();

      toast.success(result || "Review deleted successfully.");

      setSelectedRows((previous) =>
        previous.filter((item) => item !== reviewId)
      );

      refetch();
    } catch (error) {
      toast.error(
        error?.data ||
          error?.error ||
          "Unable to delete review."
      );
    }
  };

  /* =================================
     VIEW REVIEW
  ================================= */

  const handleEdit = (reviewId) => {
    setSingleReviewId(reviewId);
    setReviewFormVisible(true);
  };

  const closeReviewModal = () => {
    setReviewFormVisible(false);
    setSingleReviewId("");
  };

  /* =================================
     SELECT ROWS
  ================================= */

  const handleRowSelected = (state) => {
    setSelectedRows(
      state.selectedRows.map((row) => row._id)
    );
  };

  /* =================================
     DELETE MULTIPLE
  ================================= */

  const handleMultiDelete = async () => {
    if (!selectedRows.length) {
      toast.info("Please select at least one review.");
      return;
    }

    try {
      const result = await removeMultipleProd(
        selectedRows
      ).unwrap();

      if (result === "item not selected") {
        toast.error(result);
      } else {
        toast.success(
          result ||
            `${selectedRows.length} reviews deleted successfully.`
        );
      }

      setSelectedRows([]);
      refetch();
    } catch (error) {
      toast.error(
        error?.data ||
          error?.error ||
          "Unable to delete selected reviews."
      );
    }
  };

  /* =================================
     UPDATE STATUS
  ================================= */

  const handleUpdateStatus = async (event) => {
    event.preventDefault();

    if (!selectedRows.length) {
      toast.info("Please select at least one review.");
      return;
    }

    if (!updatecommentstatus) {
      toast.info("Please select a review status.");
      return;
    }

    try {
      const result = await reviewUpdated({
        updatecommentstatus,
        selectedRows,
      }).unwrap();

      if (result === "select item review status updated") {
        toast.success(result);
      } else {
        toast.error(result || "Unable to update review status.");
      }

      setSelectedRows([]);
      setUpdateStatus("");
      refetch();
    } catch (error) {
      toast.error(
        error?.data ||
          error?.error ||
          "Unable to update review status."
      );
    }
  };

  /* =================================
     STAR RATING
  ================================= */

  const StarRating = ({ value = 0, size = 15 }) => {
    const rating = Number(value) || 0;

    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? "currentColor" : "none"}
            strokeWidth={star <= rating ? 0 : 1.8}
          />
        ))}
      </div>
    );
  };

  /* =================================
     TABLE COLUMNS
  ================================= */

  const columns = [
    {
      name: "CUSTOMER",
      selector: (row) => row.name,
      sortable: true,
      grow: 1.5,
      cell: (row) => (
        <div className="review-customer">
          <div className="review-avatar">
            {row.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <strong>{row.name || "Unknown User"}</strong>
            <span>{row.email || "No email"}</span>
          </div>
        </div>
      ),
    },

    {
      name: "RATING",
      selector: (row) => row.rating,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div className="rating-cell">
          <StarRating value={row.rating} />

          <span>
            {row.rating || 0}.0
          </span>
        </div>
      ),
    },

    {
      name: "COMMENT",
      selector: (row) => row.comment,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="review-comment-cell">
          <MessageSquare size={15} />

          <span title={row.comment}>
            {row.comment || "No comment"}
          </span>
        </div>
      ),
    },

    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      width: "145px",
      cell: (row) => {
        const isApproved = row.status === "approved";

        return (
          <span
            className={`review-status ${
              isApproved ? "approved" : "pending"
            }`}
          >
            {isApproved ? (
              <CheckCircle2 size={14} />
            ) : (
              <Clock3 size={14} />
            )}

            {row.status || "pending"}
          </span>
        );
      },
    },

    {
      name: "ACTIONS",
      width: "135px",
      cell: (row) => (
        <div className="review-action-buttons">
          <button
            type="button"
            className="review-view-btn"
            onClick={() => handleEdit(row._id)}
            title="View review"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className="review-delete-btn"
            onClick={() => handleDelete(row._id)}
            title="Delete review"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-reviews-page">
      <Sidebarmenu />

      <main className="product-reviews-main">
        {/* =================================
            HEADER
        ================================= */}

        <header className="reviews-header">
          <div>
            <div className="reviews-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <strong>Reviews</strong>
            </div>

            <div className="reviews-title">
              <div className="reviews-title-icon">
                <MessageSquare size={25} />
              </div>

              <div>
                <h1>Product Reviews</h1>

                <p>
                  Manage customer feedback, ratings and
                  review visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="reviews-header-badge">
            <ShieldCheck size={18} />
            <span>Review Management</span>
          </div>
        </header>

        {/* =================================
            STATS
        ================================= */}

        <section className="review-stats-grid">
          <div className="review-stat-card">
            <div className="review-stat-icon blue">
              <MessageSquare size={20} />
            </div>

            <div>
              <span>Total Reviews</span>
              <strong>{totalReviews}</strong>
              <small>Customer feedback</small>
            </div>
          </div>

          <div className="review-stat-card">
            <div className="review-stat-icon yellow">
              <Star size={20} />
            </div>

            <div>
              <span>Average Rating</span>
              <strong>{averageRating}</strong>
              <small>Out of 5.0</small>
            </div>
          </div>

          <div className="review-stat-card">
            <div className="review-stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Approved</span>
              <strong>{approvedReviews}</strong>
              <small>Published reviews</small>
            </div>
          </div>

          <div className="review-stat-card">
            <div className="review-stat-icon orange">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingReviews}</strong>
              <small>Awaiting approval</small>
            </div>
          </div>
        </section>

        {/* =================================
            SEARCH
        ================================= */}

        <section className="reviews-search-card">
          <div className="reviews-search-heading">
            <div className="reviews-search-icon">
              <Users size={19} />
            </div>

            <div>
              <h3>Customer Reviews</h3>
              <p>
                Search and manage all submitted reviews.
              </p>
            </div>
          </div>

          <div className="reviews-search-wrapper">
            <Searchbar statesearchpro={setSearchpro} />
          </div>
        </section>

        {/* =================================
            BULK ACTIONS
        ================================= */}

        <section
          className={`review-bulk-toolbar ${
            selectedRows.length > 0 ? "active" : ""
          }`}
        >
          <div className="review-selected-info">
            <div className="selected-review-count">
              {selectedRows.length}
            </div>

            <div>
              <strong>
                {selectedRows.length
                  ? `${selectedRows.length} review${
                      selectedRows.length > 1 ? "s" : ""
                    } selected`
                  : "Select reviews"}
              </strong>

              <span>
                {selectedRows.length
                  ? "Choose an action for the selected reviews."
                  : "Use the checkboxes in the table to manage multiple reviews."}
              </span>
            </div>
          </div>

          <div className="review-bulk-actions">
            <form
              className="review-status-form"
              onSubmit={handleUpdateStatus}
            >
              <div className="review-status-select">
                <select
                  value={updatecommentstatus}
                  onChange={(event) =>
                    setUpdateStatus(event.target.value)
                  }
                >
                  <option value="">
                    Select status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>
                </select>

                <ChevronDown size={15} />
              </div>

              <button
                type="submit"
                className="review-update-btn"
                disabled={
                  !selectedRows.length || isUpdating
                }
              >
                <CheckCircle2 size={16} />

                {isUpdating
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </form>

            <button
              type="button"
              className="review-delete-selected-btn"
              onClick={handleMultiDelete}
              disabled={
                !selectedRows.length || isDeletingMultiple
              }
            >
              <Trash2 size={16} />

              {isDeletingMultiple
                ? "Deleting..."
                : "Delete Selected"}
            </button>
          </div>
        </section>

        {/* =================================
            TABLE
        ================================= */}

        <section className="reviews-table-card">
          <div className="reviews-table-header">
            <div>
              <h3>All Reviews</h3>
              <p>
                Review customer feedback and moderate
                submitted comments.
              </p>
            </div>

            <div className="reviews-table-count">
              {prodata.length}{" "}
              {prodata.length === 1
                ? "Review"
                : "Reviews"}
            </div>
          </div>

          <div className="reviews-table-wrapper">
            <ReuseDataTable
              data={prodata}
              columns={columns}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
              pagination
              progressPending={isLoading}
            />
          </div>
        </section>
      </main>

      {/* =================================
          REVIEW MODAL
      ================================= */}

      {reviewFormVisible && (
        <div
          className="review-modal-overlay"
          onClick={closeReviewModal}
        >
          <div
            className="review-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="review-modal-close"
              onClick={closeReviewModal}
            >
              <X size={18} />
            </button>

            {isSingleReviewLoading ? (
              <div className="review-modal-loading">
                <div className="review-loading-spinner" />
                <span>Loading review...</span>
              </div>
            ) : (
              <>
                <div className="review-modal-top">
                  <div className="review-modal-icon">
                    <MessageSquare size={21} />
                  </div>

                  <div>
                    <span>Customer Review</span>
                    <h2>Review Details</h2>
                  </div>
                </div>

                <div className="review-modal-customer">
                  <div className="review-modal-avatar">
                    {singleReview?.[0]?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h3>
                      {singleReview?.[0]?.name ||
                        "Unknown Customer"}
                    </h3>

                    <p>
                      {singleReview?.[0]?.email ||
                        "No email available"}
                    </p>
                  </div>
                </div>

                <div className="review-modal-rating">
                  <div>
                    <span>Customer Rating</span>

                    <strong>
                      {singleReview?.[0]?.rating || 0}.0 / 5.0
                    </strong>
                  </div>

                  <StarRating
                    value={
                      singleReview?.[0]?.rating || 0
                    }
                    size={20}
                  />
                </div>

                <div className="review-modal-comment">
                  <div className="comment-heading">
                    <MessageSquare size={16} />
                    <span>Customer Comment</span>
                  </div>

                  <p>
                    {singleReview?.[0]?.comment ||
                      "No comment provided."}
                  </p>
                </div>

                <div className="review-modal-footer">
                  <span
                    className={`review-status ${
                      singleReview?.[0]?.status ===
                      "approved"
                        ? "approved"
                        : "pending"
                    }`}
                  >
                    {singleReview?.[0]?.status ===
                    "approved" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock3 size={14} />
                    )}

                    {singleReview?.[0]?.status ||
                      "pending"}
                  </span>

                  <button
                    type="button"
                    onClick={closeReviewModal}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Productreviews;
