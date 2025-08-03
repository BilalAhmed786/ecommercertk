import React, { useEffect, useState } from 'react';
import Sidebarmenu from './component/Sidebarmenu';
import ReuseDataTable from './component/reactdatatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import Searchbar from './component/searchbar';
import { toast } from 'react-toastify';
import {
  useGetReviewsforadminQuery,
  useGetSingleReviewsforadminQuery,
  useDeletesinglereviewMutation,
  useDeletemultireviewsMutation,
  useUpdatereviewstatusMutation
} from '../app/apiproducts';

function Productreviews() {
  const [prodata, setProdata] = useState([]);
  const [searchpro, setSearchpro] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [id, setSingleReviewId] = useState('');
  const [updatecommentstatus, setUpdateStatus] = useState('');
  const [reviewFormVisible, setReviewFormVisible] = useState(false);

  const { data, refetch } = useGetReviewsforadminQuery(searchpro);
  const { data: singleReview, refetch: reviewSingle } = useGetSingleReviewsforadminQuery(id);
  const [removeprod] = useDeletesinglereviewMutation();
  const [removeMultipleProd] = useDeletemultireviewsMutation();
  const [reviewUpdated] = useUpdatereviewstatusMutation();
  

  useEffect(() => {
    if (data) setProdata(data.Reviews || []);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id);
      if (result.data) {
        refetch();
        toast.success(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    setSingleReviewId(id);
    setReviewFormVisible(true);
    reviewSingle();
  };

  const handleRowSelected = (rows) => {
    console.log(rows)
    setSelectedRows(rows.selectedRows.map((row) => row._id));
  };

  const handleMultiDelete = async (e) => {
    e.preventDefault();
    try {
      const result = await removeMultipleProd(selectedRows);
      if (result && result.data) {
        result.data !== 'item not selected' ? toast.success(result.data) : toast.error(result.data);
        refetch();
      }
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      const result = await reviewUpdated({ updatecommentstatus,selectedRows });
      console.log(result)
      if (result && result.data) {
        result.data === 'select item review status updated'
          ? toast.success(result.data)
          : toast.error(result.data);
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const StarRatingCell = ({ value }) => {
    return <div>{Array.from({ length: value }, (_, i) => <span key={i}>★</span>)}</div>;
  };

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Rating', sortable: true, cell: (row) => <StarRatingCell value={row.rating} /> },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Comment', selector: (row) => row.comment, sortable: true, width: '200px' },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-icons">
          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />
          <FontAwesomeIcon icon={faEye} onClick={() => handleEdit(row._id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />
      <div className="marquee-container">
        <h3 className="page-title">Product Reviews</h3>

        <Searchbar statesearchpro={setSearchpro} />

        {prodata.length > 0 && (
          <>
            <div className="selecteddeleteitem">
              <a onClick={handleMultiDelete}>Delete Selected</a>
              <div>({selectedRows.length})</div>
            </div>
            <form className="status-form" onSubmit={handleUpdateStatus}>
              <button className="status-btn" type="submit">Update ({selectedRows.length})</button>
              <select className="status"  onChange={(e) => setUpdateStatus(e.target.value)}>
                <option value="">Select</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </form>
          </>
        )}

        <ReuseDataTable
          data={prodata}
          columns={columns}
          selectedRows={selectedRows}
          onRowSelected={handleRowSelected}
        />

        {reviewFormVisible && (
          <div className="review-modal">
            <div className="review-card">
              <button className="close-btn" onClick={() => setReviewFormVisible(false)}>×</button>
              <h6>Client Review</h6>
              <p>{singleReview?.[0]?.name}</p>
              <div className="stars"><StarRatingCell value={singleReview?.[0]?.rating || 0} /></div>
              <p className="commentset">{singleReview?.[0]?.comment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productreviews;
