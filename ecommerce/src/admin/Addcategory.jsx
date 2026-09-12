import React, { useEffect, useState } from "react";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronRight,
  Layers3,
  X,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";
import Sidebarmenu from "./component/Sidebarmenu";
import Searchbar from "./component/searchbar";
import ReuseDataTable from "./component/reactdatatable";
import {
  useSubmitProductCategeroyMutation,
  useGetProductCategeroyQuery,
  useUpdateProductCategeroyMutation,
  useGetsingleProductCategeroyQuery,
  useDeleteProductCategeroyMutation,
} from "../app/apiproducts";
function Addcategory() {
  const [modelformdisplay, statemodeform] = useState(false);
  const [id, setId] = useState("");
  const [searchitem, statesearchpro] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [productcatval, stateproductcatval] = useState({ productcat: "" });
  const [singleupdatedata, singlecatupdate] = useState({ productcat: "" });
  const [productcat, { isLoading: isAdding }] =
    useSubmitProductCategeroyMutation();
  const { data, isLoading, refetch } = useGetProductCategeroyQuery(searchitem);
  const { data: singlecategory, isFetching: isFetchingCategory } =
    useGetsingleProductCategeroyQuery(id, { skip: !id });
  const [updateproCat, { isLoading: isUpdating }] =
    useUpdateProductCategeroyMutation();
  const [deleteproCat, { isLoading: isDeleting }] =
    useDeleteProductCategeroyMutation();
  const categories = data || [];
  /* ===================================== LOAD SINGLE CATEGORY ===================================== */ useEffect(() => {
    if (singlecategory) {
      singlecatupdate(singlecategory[0] || { productcat: "" });
    }
  }, [singlecategory]);
  /* ===================================== ADD CATEGORY ===================================== */ const changehandler =
    (e) => {
      const { name, value } = e.target;
      stateproductcatval((prev) => ({ ...prev, [name]: value }));
    };
  const productcathandle = async (e) => {
    e.preventDefault();
    if (!productcatval.productcat.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const result = await productcat({
        productcat: productcatval.productcat.trim(),
      });
      if (result?.data === "category saved") {
        toast.success(result.data);
        stateproductcatval({ productcat: "" });
        refetch();
      } else {
        toast.error(result?.data || "Unable to save category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  /* ===================================== EDIT CATEGORY ===================================== */ const editHandle =
    (categoryId) => {
      setId(categoryId);
      statemodeform(true);
    };
  const singlecathandle = (e) => {
    const { name, value } = e.target;
    singlecatupdate((prev) => ({ ...prev, [name]: value }));
  };
  const updatecatHandle = async (e) => {
    e.preventDefault();
    if (!singleupdatedata.productcat.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const result = await updateproCat({
        ...singleupdatedata,
        productcat: singleupdatedata.productcat.trim(),
        id,
      });
      if (result?.data === "update successfully") {
        toast.success(result.data);
        statemodeform(false);
        setId("");
        refetch();
      } else {
        toast.error(result?.data || "Unable to update category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  /* ===================================== DELETE SINGLE ===================================== */ const deleteHandle =
    async (categoryId) => {
      try {
        const result = await deleteproCat(categoryId);
        if (result?.data) {
          toast.success(result.data);
          refetch();
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to delete category");
      }
    };
  /* ===================================== SELECT ROWS ===================================== */ const handleRowSelected =
    (rows) => {
      setSelectedRows(rows.selectedRows);
    };
  /* ===================================== DELETE SELECTED ===================================== */ const handleDeleteSelected =
    async () => {
      if (!selectedRows.length) {
        toast.error("Please select at least one category");
        return;
      }
      try {
        for (const row of selectedRows) {
          await deleteproCat(row._id);
        }
        toast.success(
          `${selectedRows.length} ${selectedRows.length === 1 ? "category" : "categories"} deleted`,
        );
        setSelectedRows([]);
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Unable to delete selected categories");
      }
    };
  /* ===================================== TABLE COLUMNS ===================================== */ const columns =
    [
      {
        name: "Category",
        selector: (row) => row.productcat,
        sortable: true,
        cell: (row) => (
          <div className="category-table-name">
            {" "}
            <div className="category-row-icon">
              {" "}
              <Tags size={16} />{" "}
            </div>{" "}
            <div>
              {" "}
              <span className="category-name"> {row.productcat} </span>{" "}
              <span className="category-label"> Product category </span>{" "}
            </div>{" "}
          </div>
        ),
      },
      {
        name: "Actions",
        right: true,
        cell: (row) => (
          <div className="category-action-buttons">
            {" "}
            <button
              type="button"
              className="category-edit-btn"
              onClick={() => editHandle(row._id)}
              title="Edit category"
            >
              {" "}
              <Pencil size={16} />{" "}
            </button>{" "}
            <button
              type="button"
              className="category-delete-btn"
              onClick={() => deleteHandle(row._id)}
              disabled={isDeleting}
              title="Delete category"
            >
              {" "}
              <Trash2 size={16} />{" "}
            </button>{" "}
          </div>
        ),
      },
    ];
  return (
    <div className="category-page">
      {" "}
      <Sidebarmenu />{" "}
      <main className="category-main">
        {" "}
        {/* ===================================== HEADER ===================================== */}{" "}
        <div className="category-header">
          {" "}
          <div>
            {" "}
            <div className="category-breadcrumb">
              {" "}
              Dashboard <ChevronRight size={14} /> Categories{" "}
            </div>{" "}
            <div className="category-title-row">
              {" "}
              <div className="category-title-icon">
                {" "}
                <Tags size={24} />{" "}
              </div>{" "}
              <div>
                {" "}
                <h1>Product Categories</h1>{" "}
                <p> Create and manage your product categories </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="category-count-badge">
            {" "}
            <Layers3 size={16} /> {categories.length} Categories{" "}
          </div>{" "}
        </div>{" "}
        {/* ===================================== ADD CATEGORY CARD ===================================== */}{" "}
        <section className="category-add-card">
          {" "}
          <div className="category-add-header">
            {" "}
            <div className="category-add-icon">
              {" "}
              <Plus size={20} />{" "}
            </div>{" "}
            <div>
              {" "}
              <h2>Add New Category</h2>{" "}
              <p> Create a new category for your products </p>{" "}
            </div>{" "}
          </div>{" "}
          <form className="category-form" onSubmit={productcathandle}>
            {" "}
            <div className="category-input-wrapper">
              {" "}
              <Tags size={17} />{" "}
              <input
                name="productcat"
                type="text"
                value={productcatval.productcat}
                placeholder="Enter category name"
                onChange={changehandler}
                required
              />{" "}
            </div>{" "}
            <button
              type="submit"
              className="category-submit-btn"
              disabled={isAdding}
            >
              {" "}
              <Plus size={17} /> {isAdding ? "Adding..." : "Add Category"}{" "}
            </button>{" "}
          </form>{" "}
        </section>{" "}
        {/* ===================================== SEARCH ===================================== */}{" "}
        <section className="category-search-card">
          {" "}
          <div className="category-search-heading">
            {" "}
            <div className="category-search-icon">
              {" "}
              <Search size={18} />{" "}
            </div>{" "}
            <div>
              {" "}
              <h3>Find Categories</h3>{" "}
              <p> Search through your product categories </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="category-search-input">
            {" "}
            <Searchbar statesearchpro={statesearchpro} />{" "}
          </div>{" "}
        </section>{" "}
        {/* ===================================== BULK ACTION ===================================== */}{" "}
        <div className="category-bulk-toolbar">
          {" "}
          <div className="category-selected-info">
            {" "}
            <div className="category-selected-icon">
              {" "}
              <Tags size={17} />{" "}
            </div>{" "}
            <div>
              {" "}
              <strong> {selectedRows.length} selected </strong>{" "}
              <span> Select categories from the table </span>{" "}
            </div>{" "}
          </div>{" "}
          <button
            type="button"
            className="category-delete-selected"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0 || isDeleting}
          >
            {" "}
            <Trash2 size={17} /> Delete Selected{" "}
          </button>{" "}
        </div>{" "}
        {/* ===================================== TABLE ===================================== */}{" "}
        <section className="category-table-card">
          {" "}
          <div className="category-table-header">
            {" "}
            <div>
              {" "}
              <div className="category-table-title">
                {" "}
                <Layers3 size={18} /> <h2>All Categories</h2>{" "}
              </div>{" "}
              <p> Manage your existing product categories </p>{" "}
            </div>{" "}
            <span className="category-table-count">
              {" "}
              {categories.length} records{" "}
            </span>{" "}
          </div>{" "}
          <div className="category-table-wrapper">
            {" "}
            <ReuseDataTable
              columns={columns}
              data={categories}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
              progressPending={isLoading}
              pagination
            />{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
      {/* ===================================== EDIT MODAL ===================================== */}{" "}
      {modelformdisplay && (
        <div
          className="category-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isUpdating) {
              statemodeform(false);
            }
          }}
        >
          {" "}
          <div className="category-modal">
            {" "}
            <div className="category-modal-header">
              {" "}
              <div className="category-modal-title">
                {" "}
                <div className="category-modal-icon">
                  {" "}
                  <Pencil size={18} />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h2>Edit Category</h2>{" "}
                  <p> Update the category information </p>{" "}
                </div>{" "}
              </div>{" "}
              <button
                type="button"
                className="category-modal-close"
                onClick={() => statemodeform(false)}
                disabled={isUpdating}
              >
                {" "}
                <X size={18} />{" "}
              </button>{" "}
            </div>{" "}
            <form className="category-edit-form" onSubmit={updatecatHandle}>
              {" "}
              <label htmlFor="edit-productcat"> Category Name </label>{" "}
              <div className="category-modal-input">
                {" "}
                <Tags size={17} />{" "}
                <input
                  id="edit-productcat"
                  type="text"
                  name="productcat"
                  value={singleupdatedata.productcat}
                  onChange={singlecathandle}
                  placeholder="Category name"
                  required
                  autoFocus
                  disabled={isFetchingCategory}
                />{" "}
              </div>{" "}
              <div className="category-modal-actions">
                {" "}
                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={() => statemodeform(false)}
                  disabled={isUpdating}
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="category-update-btn"
                  disabled={isUpdating || isFetchingCategory}
                >
                  {" "}
                  <Save size={16} />{" "}
                  {isUpdating ? "Updating..." : "Save Changes"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default Addcategory;
