import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./myOrders.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMyOrders,
  clearError,
  getLoadingState,
  getError,
  callMyOrdersApi,
  clearErrors,
} from "../../store/entities/orders";
import ActiveLoader from "../loader";
import { Typography } from "@mui/material";
import MetaData from "../layouts/MetaData";
import { Link } from "react-router-dom";
import Alert from "../pop-up";
import LaunchIcon from "@mui/icons-material/Launch";
import { getUserDetails } from "../../store/auth";

const MyOrders = () => {
  const [open, setOpen] = React.useState(false);

  const myOrders = useSelector(getAllMyOrders);
  const error = useSelector(getError);
  const user = useSelector(getUserDetails);
  const isLoading = useSelector(getLoadingState);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5, cellClassName: (params) => {
        // console.log(params.id)
        return myOrders?.find(item => item?._id === params?.id)?.orderStatus === "Delivered" ? "greenColor" : "redColor";
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
          <Link to={`/order/${params?.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  myOrders &&
    myOrders.forEach((item, index) => {
      rows.push({
        itemsQty: item?.orderItems?.length,
        id: item?._id,
        status: item?.orderStatus,
        amount: item?.totalPrice,
      });
    });

  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // if (Object.keys(error).length > 0) {
    //   setOpen(true);
    //   dispatch(clearErrors());
    // }

    dispatch(callMyOrdersApi());
  }, []);

  return (
    <Fragment>
      <MetaData title={`${user?.name} - orders`} />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
            pageSizeOptions={[5, 10, 25]}
          />
          <Typography id="myOrdersHeading">{user?.name}'s Orders</Typography>
        </div>
      )}

      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={error.message}
      />
    </Fragment>
  );
};

export default MyOrders;
