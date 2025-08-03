import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReuseDataTable from '../admin/component/reactdatatable';
import Searchbar from '../admin/component/searchbar';
import { faRecycle, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAllOrdersforclientQuery,useDeleteSingleOrderclientMutation,useDeleteMultipleOrderclientMutation } from '../app/apiorders';
import { toast } from 'react-toastify'


function Clientorders(props) {

  const email =props.useremail
  const [prodata, stateprodata] = useState([])
  const [search, statesearchpro] = useState('')
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);
  const { data, isLoading, refetch } = useAllOrdersforclientQuery({search,email})
  const [removemultipleorders] = useDeleteMultipleOrderclientMutation()
  const [removeorder] = useDeleteSingleOrderclientMutation();
  
  
  const handleDelete = async (id) => {
    try {
      const result = await removeorder(id)

      if (result.data) {

        refetch()

        toast.success(result.data)

      }
    } catch (error) {
      console.log(error)
    }
  }

  //multiple products delete
  const handleRowSelected = (rows) => {

    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount)
  };


  const handlemultiitemDelete = async () => {
    try {
      // Extract IDs of selected rows
      const ids = selectedRows.map(row => row._id);

      const result = await removemultipleorders(ids)

      if (result) {

        if (result.data !== 'no item selected') {


          toast.success(result.data)
         
          window.location.reload()
        

        } else {

          toast.error(result.data)
        }

      } else {

        console.log('no response')
      }

    } catch (error) {
      console.error('Error deleting records:', error);
    }


  }

  useEffect(() => {


    stateprodata(data?data.orders:'')

    refetch()


  }, [data,selectedRows,selectedItems])


  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => row.timestamp,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <a style={{ marginRight: 20 }} href={`clientorders/${row._id}`} ><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></a>
          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
    // Add more columns as needed
  ];

  return (
    <div className='dashboardcontainer'>



    <Sidebarmenu />


    <div className="marquee-container">

      <h5 className="page-title">Orders Detail</h5>
      <Searchbar statesearchpro={statesearchpro}/>
      {prodata && prodata.length > 0 ?
        <div className='selecteddeleteitem'> <a onClick={handlemultiitemDelete}>Delete Selected</a><div>({selectedItems})</div></div>
        : null}

      <div>
        <ReuseDataTable
             data={prodata}
            columns={columns}
            selectedRows={selectedRows}
            onRowSelected={handleRowSelected}
        
        />

      </div>




    </div>


  </div>
  )
}

export default Clientorders