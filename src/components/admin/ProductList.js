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
  deleteProduct,
  getAdminProducts,
  getProductDeleted,
  resetProductDeleteStatus,
  startCallingAdminProductsApi,
} from "../../store/entities/product";
import Alert from "../pop-up";

const ProductList = () => {
  const dispatch = useDispatch();

  const products = useSelector(getAdminProducts);
  const isProductDeleted = useSelector(getProductDeleted);

  const navigate = useNavigate();

  const onClose = () => {
    dispatch(resetProductDeleteStatus());
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    dispatch(startCallingAdminProductsApi());
  }, []);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  // useEffect(() => {
  //   if (isProductDeleted) {
  //     onClose()
  //   }
  // }, [isProductDeleted]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 350, flex: 1 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
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
            <Link to={`/admin/product/${params?.id}`}>
              <EditIcon />
            </Link>
            <IconButton onClick={() => deleteProductHandler(params?.id)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item?._id,
        stock: item?.Stock,
        price: item?.price,
        name: item?.name,
      });
    });

  return (
    <Fragment>
      <MetaData title="All products - Admin" />
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
        message="Product deleted successfully"
        open={isProductDeleted}
        handleClose={onClose}
      />
    </Fragment>
  );
};

export default ProductList;
