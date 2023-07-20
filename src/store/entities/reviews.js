import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as actions from "../actions/api";

export const slice = createSlice({
  name: "reviews",
  initialState: {
    success: false,
    error: {},
    isLoading: false,
  },
  reducers: {
    reviewApiStart: (reviews) => {
      reviews.isLoading = true;
    },
    reviewsApiResponse: (reviews, { payload }) => {
      reviews.success = payload?.data?.success;
      reviews.isLoading = false;
    },
    reviewsApiFailed: (reviews, { payload }) => {
      console.log('review failed ==>>', payload);
      reviews.error = payload?.data;
      reviews.isLoading = false;
    },
    clearError: (reviews, { payload }) => {
      reviews.error = {};
      reviews.isLoading = false;
    },
    resetReview: (reviews) => {
      reviews.success = false;
      reviews.error = {};
    },
  },
});

export const {
  reviewApiStart,
  reviewsApiResponse,
  reviewsApiFailed,
  clearError,
  resetReview
} = slice.actions;

export default slice.reducer;

export const addNewReview = (reviewData) => (dispatch) => {
    return dispatch(
      actions.apiCallBegan({
        url: '/review',
        data: reviewData,
        onStart: reviewApiStart.type,
        onSuccess: reviewsApiResponse.type,
        onError: reviewsApiFailed.type,
        headers: {"Content-Type": "application/json"},
        method: 'PUT',
        auth: false,
      })
    );
  };

export const getReviewSuccessStatus = createSelector(
  (state) => state.entities.reviews,
  (review) => review.success,
);

export const resetReviewStatus = () => (dispatch) => {
return dispatch({type: resetReview.type});
}

export const getReviewErrors = createSelector(
  (state) => state.entities.reviews,
  (error) => error?.error,
)
