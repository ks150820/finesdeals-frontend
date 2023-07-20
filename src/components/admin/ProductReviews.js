import React, { useEffect, Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MetaData from "../layouts/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import {
    callReviewsApi,
  callToDeleteReview,
  getAllReviews,
  getReviewsDeletedStatus,
  resetDeleteProductReviewStatus,
} from "../../store/entities/product";
import Alert from "../pop-up";
import Star from '@mui/icons-material/Star';
import { Button } from "@mui/material";

const ProductReviews = () => {
    const [isReviewDeletedAlertOpen, setIsReviewDeletedAlertOpen] = useState(false);
    const [productId, setProductId] = useState('');
  const dispatch = useDispatch();

  const reviews = useSelector(getAllReviews);
  const isReviewDeleted = useSelector(getReviewsDeletedStatus);

  const navigate = useNavigate();

  const onClose = () => {
    dispatch(resetDeleteProductReviewStatus());
    setIsReviewDeletedAlertOpen(false);
    navigate("/admin/reviews");
  };

  const deleteReviewHandler = (reviewId) => {
    dispatch(callToDeleteReview(reviewId, productId));
  };

  useEffect(() => {
    if(productId?.length > 20){
        dispatch(callReviewsApi(productId));
    }
    if (isReviewDeleted) {
    setIsReviewDeletedAlertOpen(true);
    }
  }, [isReviewDeleted, productId, dispatch]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 1 },
    { field: "user", headerName: "User", minWidth: 150, flex: 0.3 },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 150,
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
            <IconButton onClick={() => deleteReviewHandler(params?.id)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item?._id,
        rating: item?.rating,
        comment: item?.comment,
        user: item?.name,
      });
    });

    const productReviewSubmitHandler = (e) => {
        e?.preventDefault();

        dispatch(callReviewsApi(productId));
    }; 

  return (
    <Fragment>
      <MetaData title="All product reviews" />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewContainer">

        <form
            className="productReviewForm"
            onSubmit={productReviewSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">All Reviews</h1>
            <div>
              <Star />
              <input
                type="text"
                placeholder="Product ID"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={productId === "" ? true : false}
            >
              Search
            </Button>
          </form>

         {
            reviews && reviews?.length > 0 ?  <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          /> : <h1 className="productReviewsFormHeading">No Reviews Found</h1>
         }
        </div>
      </div>
      <Alert
        message="Review deleted successfully"
        open={isReviewDeletedAlertOpen}
        handleClose={onClose}
      />
    </Fragment>
  );
};

export default ProductReviews;
