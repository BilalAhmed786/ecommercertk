import React, { useEffect, useState } from 'react';
import Sidebarmenu from './component/Sidebarmenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Searchbar from './component/searchbar';
import ReuseDataTable from './component/reactdatatable'; // ✅ your reusable table
import {
    useSubmitProductCategeroyMutation,
    useGetProductCategeroyQuery,
    useUpdateProductCategeroyMutation,
    useGetsingleProductCategeroyQuery,
    useDeleteProductCategeroyMutation
} from '../app/apiproducts';

function Addcategory() {
    const [modelformdisplay, statemodeform] = useState(false);
    const [id, setId] = useState('');
    const [searchitem, statesearchpro] = useState('');
    const [productcat] = useSubmitProductCategeroyMutation();
    const [selectedRows, setSelectedRows] = useState([]);
    const { data, refetch } = useGetProductCategeroyQuery(searchitem);
    const { data: singlecategory, refetch: singleCat } = useGetsingleProductCategeroyQuery(id);
    const [updateproCat] = useUpdateProductCategeroyMutation();
    const [deleteproCat] = useDeleteProductCategeroyMutation();
    const [productcatval, stateproductcatval] = useState({ productcat: '' });
    const [singleupdatedata, singlecatupdate] = useState({ productcat: '' });



    useEffect(() => {
        if (singlecategory) {
            singlecatupdate(singlecategory[0] || { productcat: '' });
        }
    }, [singlecategory]);

    const changehandler = (e) => {
        const { name, value } = e.target;
        stateproductcatval({ ...productcatval, [name]: value });
    };

    const singlecathandle = (e) => {
        const { name, value } = e.target;
        singlecatupdate({ ...singleupdatedata, [name]: value });
    };

    const productcathandle = async (e) => {
        e.preventDefault();
        try {
            const result = await productcat(productcatval);
            if (result?.data === 'category saved') {
                toast.success(result.data);
                refetch();
            } else {
                toast.error(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteSelected = async()=> {
    for (const row of selectedRows) {
      await deleteproCat(row._id)
      refetch()
    }
    setSelectedRows([]); // clear selection
  }



    const editHandle = (id) => {
        setId(id);
        statemodeform(true);
        singleCat();
    };

    const handleRowSelected = (rows) => {

        setSelectedRows(rows.selectedRows);
    };

    const updatecatHandle = async (e) => {
        e.preventDefault();
        try {
            const result = await updateproCat({ ...singleupdatedata, id });
            if (result?.data === 'update successfully') {
                toast.success(result.data);
                statemodeform(false);
                refetch();
            } else {
                toast.error(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteHandle = async (id) => {
        try {
            const result = await deleteproCat(id);
            if (result?.data) {
                toast.success(result.data);
                refetch();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            name: 'Category',
            selector: row => row.productcat,
            sortable: true
        },
        {
            name: 'Edit',
            cell: row => (
                <FontAwesomeIcon icon={faEdit} onClick={() => editHandle(row._id)} style={{ cursor: 'pointer', color: '#007bff' }} />
            ),
            ignoreRowClick: true
        },
        {
            name: 'Delete',
            cell: row => (
                <FontAwesomeIcon icon={faRecycle} onClick={() => deleteHandle(row._id)} style={{ cursor: 'pointer', color: 'red' }} />
            ),
            ignoreRowClick: true
        }
    ];

    return (
        <div className="dashboardcontainer">
            <Sidebarmenu />

            <div className="marquee-container">
                <h3 className="page-title">Add Category</h3>
                <form className="category-form" onSubmit={productcathandle}>

                    <input
                        name="productcat"
                        type="text"
                        placeholder="Enter category name"
                        onChange={changehandler}
                        required
                    />
                    <button type="submit" className="btn-submit">Add Category</button>
                </form>
            </div>

            <div>
                <Searchbar statesearchpro={statesearchpro} />

                <div className="selecteddeleteitem">
                    <a onClick={handleDeleteSelected}>Delete Selected</a>
                    <div>({selectedRows.length})</div>
                </div>

                <ReuseDataTable
                    columns={columns}
                    data={data || []}
                    selectedRows={selectedRows}
                    onRowSelected={handleRowSelected}
                />
            </div>

            {modelformdisplay && (
                <div className="modal-overlay">
                    <div className="modal-form">
                        <button className="close-modal" onClick={() => statemodeform(false)}>×</button>
                        <form onSubmit={updatecatHandle}>
                            <label htmlFor="productcat">Edit Category</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="productcat"
                                value={singleupdatedata.productcat}
                                onChange={singlecathandle}
                                required
                            />
                            <button type="submit" className="btn-submit">Update</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Addcategory;
