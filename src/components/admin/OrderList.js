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
import {
  callToGetAllAdminOrders,
  resetOrderDeletedStatus,
  callToDeleteOrder,
  getAdminAllOrders,
  callToUpdateAdminOrders,
  getOrderDeletedStatus,
} from "../../store/entities/orders";
import Alert from "../pop-up";

const OrderList = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getAdminAllOrders);
  const isOrderDeleted = useSelector(getOrderDeletedStatus);

  const navigate = useNavigate();

  const onClose = () => {
    dispatch(resetOrderDeletedStatus());
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    dispatch(callToGetAllAdminOrders());
  }, []);

  const deleteOrdersHandler = (id) => {
    dispatch(callToDeleteOrder(id));
  };

  // useEffect(() => {
  //   if (isProductDeleted) {
  //     onClose()
  //   }
  // }, [isProductDeleted]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5, cellClassName: (params) => {
        return orders?.find(item => item?._id === params?.id)?.orderStatus === "Delivered" ? "greenColor" : "redColor";
    } },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
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
            <Link to={`/admin/order/${params?.id}`}>
              <EditIcon />
            </Link>
            <IconButton onClick={() => deleteOrdersHandler(params?.id)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders?.forEach((item) => {
      rows.push({
        id: item?._id,
        itemsQty: item?.orderItems?.length,
        amount: item?.totalPrice,
        status: item?.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData title="All Orders - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Products</h1>
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
        message="Order deleted successfully"
        open={isOrderDeleted}
        handleClose={onClose}
      />
    </Fragment>
  );
};

export default OrderList;
