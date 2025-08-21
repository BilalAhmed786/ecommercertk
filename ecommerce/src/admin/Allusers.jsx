import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAllUserQuery, useDeleteUserMutation, useDeletemultipleUserMutation, useSingleUserQuery, useUpdateSingleUserMutation } from '../app/apiusers';
import { toast } from 'react-toastify'
import ReuseDataTable from './component/reactdatatable';
import Searchbar from './component/searchbar';


function Allusers() {
  const [prodata, stateprodata] = useState([])
  const [searchpro, statesearchpro] = useState('')
  const [id, setSingleuser] = useState('');
  const [formtoggle, magicformtoggle] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);
  const { data, isLoading, refetch } = useAllUserQuery(searchpro)
  const [removeprod] = useDeleteUserMutation();
  const { data: singleuser, refetch: singlerefetch } = useSingleUserQuery(id)
  const [updateuserrecord] = useUpdateSingleUserMutation()
  const [removemultipleuser] = useDeletemultipleUserMutation()

  useEffect(() => {
    stateprodata(data ? data.Users : '')
    userUpdate(singleuser ? singleuser[0] : '')
    refetch()
  }, [data, singleuser])

  const [updateuser, userUpdate] = useState({
    name: '',
    email: '',
    role: ''
  })

  const updateuserhandle = (e) => {
    const { name, value } = e.target
    userUpdate({
      ...updateuser, [name]: value
    })
  }

  const updateformhandle = async (e) => {
    e.preventDefault()
    try {
      const result = await updateuserrecord(updateuser)
      if (result) {
        if (result.data === 'user updated!!') {
          toast.success(result.data)
        } else {
          toast.error(result.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id)
      if (result) {
        refetch()
        toast.success('user deleted successfully')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (id) => {
    setSingleuser(id)
    magicformtoggle(true)
    singlerefetch()
  }

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount)
  };

  const handlemultiitemDelete = async (e) => {
    try {
      const ids = selectedRows.map(row => row._id);
      const result = await removemultipleuser(ids)
      if (result) {
        if (result.data !== 'no item selected') {
          toast.success(result.data)
          window.location.reload()
        } else {
          toast.error(result.data)
        }
      }
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  }

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
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-icons">
          <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(row._id)} />
          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
  ];

  return (
    <div className='dashboardcontainer'>
      <Sidebarmenu />
      <div className="marquee-container">
        <h5 className='page-title' >Registered Users</h5>

        <Searchbar statesearchpro={statesearchpro} />

        {prodata && prodata.length > 0 && (
          <div className='selecteddeleteitem'>
            <a onClick={handlemultiitemDelete}>Delete Selected</a>
            <div>({selectedItems})</div>
          </div>
        )}

        <div>
          <ReuseDataTable
            data={prodata}
            columns={columns}
            selectedRows={selectedRows}
            onRowSelected={handleRowSelected}
          />
        </div>

        {formtoggle && (
          <div className="modal-overlay">
            <div className='modal-form'>
              <button className='close-btn' onClick={() => magicformtoggle(false)}>×</button>
              <h6>Edit User</h6>
              <form onSubmit={updateformhandle}>
                <div className='form-group'>
                  <label>Name</label>
                  <input type="text" name="name" value={updateuser.name} onChange={updateuserhandle} />
                </div>
                <div className='form-group'>
                  <label>Email</label>
                  <input type="text" name="email" value={updateuser.email} onChange={updateuserhandle} />
                </div>
                <div className='form-group'>
                  <label>Role</label>
                  <input type="text" name="role" value={updateuser.role} onChange={updateuserhandle} />
                </div>
                <input className='btn btn-danger' type="submit" value="Update" />
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Allusers