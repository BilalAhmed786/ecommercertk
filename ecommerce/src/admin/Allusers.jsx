import React, { useEffect, useState } from "react";
import Sidebarmenu from "./component/Sidebarmenu";
import {
  Pencil,
  Trash2,
  Users,
  ShieldCheck,
  Mail,
  UserRound,
  X,
  Save,
  UserCog,
} from "lucide-react";

import {
  useAllUserQuery,
  useDeleteUserMutation,
  useDeletemultipleUserMutation,
  useSingleUserQuery,
  useUpdateSingleUserMutation,
} from "../app/apiusers";

import { toast } from "react-toastify";
import ReuseDataTable from "./component/reactdatatable";
import Searchbar from "./component/searchbar";

function Allusers() {
  const [prodata, stateprodata] = useState([]);
  const [searchpro, statesearchpro] = useState("");
  const [id, setSingleuser] = useState("");
  const [formtoggle, magicformtoggle] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);

  const { data, refetch } = useAllUserQuery(searchpro);

  const [removeprod] = useDeleteUserMutation();

  const { data: singleuser, refetch: singlerefetch } =
    useSingleUserQuery(id);

  const [updateuserrecord] = useUpdateSingleUserMutation();
  const [removemultipleuser] = useDeletemultipleUserMutation();

  const [updateuser, userUpdate] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    stateprodata(data?.Users || []);

    if (singleuser?.[0]) {
      userUpdate(singleuser[0]);
    }
  }, [data, singleuser]);

  const updateuserhandle = (e) => {
    const { name, value } = e.target;

    userUpdate({
      ...updateuser,
      [name]: value,
    });
  };

  const updateformhandle = async (e) => {
    e.preventDefault();

    try {
      const result = await updateuserrecord(updateuser);

      if (result) {
        if (result.data === "user updated!!") {
          toast.success(result.data);
          magicformtoggle(false);
          refetch();
        } else {
          toast.error(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id);

      if (result) {
        refetch();
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    setSingleuser(id);
    magicformtoggle(true);
    singlerefetch();
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount);
  };

  const handlemultiitemDelete = async () => {
    try {
      if (selectedRows.length === 0) {
        toast.error("No item selected");
        return;
      }

      const ids = selectedRows.map((row) => row._id);

      const result = await removemultipleuser(ids);

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
    }
  };

  const columns = [
    {
      name: "NAME",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="user-table-name">
          <div className="user-table-avatar">
            <UserRound size={16} />
          </div>

          <span>{row.name || "Unnamed User"}</span>
        </div>
      ),
      grow: 1.4,
    },

    {
      name: "EMAIL",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div className="user-table-email">
          <Mail size={15} />
          <span>{row.email}</span>
        </div>
      ),
      grow: 1.7,
    },

    {
      name: "ROLE",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <span className="user-role-badge">
          <ShieldCheck size={13} />
          {row.role}
        </span>
      ),
    },

    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="user-action-icons">
          <button
            type="button"
            className="user-action-btn edit"
            onClick={() => handleEdit(row._id)}
            title="Edit user"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="user-action-btn delete"
            onClick={() => handleDelete(row._id)}
            title="Delete user"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "140px",
    },
  ];

  return (
    <div className="users-page">
      <Sidebarmenu />

      <main className="users-main">
        {/* Header */}
        <header className="users-header">
          <div className="users-heading">
            <div className="users-heading-icon">
              <Users size={23} strokeWidth={2} />
            </div>

            <div>
              <span className="users-eyebrow">USER MANAGEMENT</span>
              <h1>Registered Users</h1>
              <p>Manage your customers and administrator accounts.</p>
            </div>
          </div>

          <div className="users-count">
            <span>Total Users</span>
            <strong>{prodata.length}</strong>
          </div>
        </header>

        {/* Toolbar */}
        <section className="users-toolbar">
          <div className="users-toolbar-left">
            <div className="users-toolbar-label">
              <UserCog size={17} />
              <span>User Directory</span>
            </div>
          </div>

          <div className="users-toolbar-search">
            <Searchbar
              statesearchpro={statesearchpro}
              placeholder="Search users..."
            />
          </div>
        </section>

        {/* Selected rows toolbar */}
        {selectedItems > 0 && (
          <div className="selected-users-toolbar">
            <div className="selected-users-info">
              <div className="selected-users-icon">
                <Users size={16} />
              </div>

              <div>
                <strong>{selectedItems} users selected</strong>
                <span>Selected users are ready for deletion</span>
              </div>
            </div>

            <button
              type="button"
              className="delete-selected-btn"
              onClick={handlemultiitemDelete}
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        )}

        {/* Table */}
        <section className="users-table-card">
          <div className="users-table-header">
            <div>
              <h2>All Users</h2>
              <p>View and manage registered accounts.</p>
            </div>

            <div className="users-table-status">
              <span></span>
              Active Directory
            </div>
          </div>

          <div className="users-table-wrapper">
            <ReuseDataTable
              data={prodata}
              columns={columns}
              selectedRows={selectedRows}
              onRowSelected={handleRowSelected}
            />
          </div>
        </section>

        {/* Edit Modal */}
        {formtoggle && (
          <div
            className="users-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                magicformtoggle(false);
              }
            }}
          >
            <div className="users-modal">
              <div className="users-modal-header">
                <div className="users-modal-title">
                  <div className="users-modal-icon">
                    <Pencil size={19} />
                  </div>

                  <div>
                    <span>ACCOUNT MANAGEMENT</span>
                    <h2>Edit User</h2>
                  </div>
                </div>

                <button
                  type="button"
                  className="users-modal-close"
                  onClick={() => magicformtoggle(false)}
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>

              <form
                className="users-edit-form"
                onSubmit={updateformhandle}
              >
                <div className="user-form-grid">
                  {/* Name */}
                  <div className="user-form-group full">
                    <label htmlFor="user-name">Full Name</label>

                    <div className="user-input-wrapper">
                      <UserRound size={17} />

                      <input
                        id="user-name"
                        type="text"
                        name="name"
                        value={updateuser.name || ""}
                        onChange={updateuserhandle}
                        placeholder="Enter user's name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="user-form-group">
                    <label htmlFor="user-email">Email Address</label>

                    <div className="user-input-wrapper">
                      <Mail size={17} />

                      <input
                        id="user-email"
                        type="email"
                        name="email"
                        value={updateuser.email || ""}
                        onChange={updateuserhandle}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="user-form-group">
                    <label htmlFor="user-role">Role</label>

                    <div className="user-input-wrapper">
                      <ShieldCheck size={17} />

                      <input
                        id="user-role"
                        type="text"
                        name="role"
                        value={updateuser.role || ""}
                        onChange={updateuserhandle}
                        placeholder="Enter role"
                      />
                    </div>
                  </div>
                </div>

                <div className="users-modal-footer">
                  <button
                    type="button"
                    className="cancel-user-btn"
                    onClick={() => magicformtoggle(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-user-btn">
                    <Save size={17} />
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Allusers;