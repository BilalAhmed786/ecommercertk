import { useState } from "react";
import { useGetRangeQuery,
         useAddRangeMutation,
         useUpdateRangeMutation, 
         useDeleteRangeMutation,
       } from "../app/productfilter";
import ReuseDataTable from "../admin/component/reactdatatable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import Sidebarmenu from "./component/Sidebarmenu";
import Searchbar from "./component/searchbar";
import { toast } from "react-toastify";

export default function PriceRangeManager() {
  const [range, setRange] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchitem, statesearchpro] = useState('');

  const { data: ranges = [], isLoading,refetch} = useGetRangeQuery();
  const [addRange] = useAddRangeMutation();
  const [updateRange] = useUpdateRangeMutation();
  const [deleteRange] = useDeleteRangeMutation();
  


      const filterdata = ranges.filter((data)=>data.range.includes(searchitem))


  async function handleSubmit() {

    if (!/^\d+\s*-\s*\d+$/.test(range)) {

      toast.error('Enter a valid range like 0-50');

      return;
    }

    if (editId) {
      await updateRange({ id: editId, range:range });
      setEditId(null);
      refetch()
    
    } else {

      try {
        const { data,error } = await addRange({ range });

        if (data) {

           refetch()
        }


        if (error?.data) {

          toast.error(error.data)
        }

      } catch (error) {

        console.log(error)

      }


    }
    setRange("");
  }

  function handleEdit(row) {
    setEditId(row._id);
    setRange(row.range);
  }

  async function handleDelete(id) {
  
    await deleteRange(id);
    refetch()
  }

  async function handleDeleteSelected() {
    for (const row of selectedRows) {
        await deleteRange(row._id)
      refetch()
    }
    setSelectedRows([]); // clear selection
  }

  const columns = [
    { name: "Price Range", selector: (row) => row.range, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">

          <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(row)} />

          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />

        </div>
      ),
    },
  ];

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />
      <div className="title-wraper">
        <h3 className="page-title">Price Range Manager</h3>
        {editId &&
          <button
            className="edit-close"
            onClick={() => {
              setEditId('')
              setRange('')

            }}
          >X
          </button>
        }
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          placeholder="0-50"
          className="input-box"
        />
        <button onClick={handleSubmit} className="btn add">
          {editId ? "Update" : "Add"}
        </button>

      </div>
      <Searchbar statesearchpro={statesearchpro} />
      <div className="selecteddeleteitem">
        <a onClick={handleDeleteSelected}>Delete Selected</a>
        <div>({selectedRows.length})</div>
      </div>
      <ReuseDataTable
        data={filterdata}
        columns={columns}
        selectedRows={selectedRows}
        onRowSelected={(state) => setSelectedRows(state.selectedRows)}
        pagination
        progressPending={isLoading}
      />
    </div>
  );
}
