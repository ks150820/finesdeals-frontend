import React, { useEffect, Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MetaData from "../layouts/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import Alert from "../pop-up";
import {
  getAllAdminUserDetails,
  callToGetAllAdminUserDetails,
  getAdminDeletedUserStatus,
  resetAdminDeleteStatus,
  callToDeleteAdminUsers,
} from "../../store/auth";

const UsersList = () => {
  const dispatch = useDispatch();

  const users = useSelector(getAllAdminUserDetails);
  const isUserDeleted = useSelector(getAdminDeletedUserStatus);

  const navigate = useNavigate();

  const onClose = () => {
    dispatch(resetAdminDeleteStatus());
    navigate("/admin/users");
  };

  useEffect(() => {
    dispatch(callToGetAllAdminUserDetails());
  }, []);

  const deleteUserHandler = (id) => {
    dispatch(callToDeleteAdminUsers(id));
  };

  // useEffect(() => {
  //   if (isProductDeleted) {
  //     onClose()
  //   }
  // }, [isProductDeleted]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 350, flex: 1 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 270,
      flex: 0.3,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params?.id}`}>
              <EditIcon />
            </Link>
            <IconButton onClick={() => deleteUserHandler(params?.id)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item?._id,
        role: item?.role,
        email: item?.email,
        name: item?.name,
      });
    });

  return (
    <Fragment>
      <MetaData title="All users - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Users</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
      <Alert
        message="User deleted successfully"
        open={isUserDeleted}
        handleClose={onClose}
      />
    </Fragment>
  );
};

export default UsersList;
