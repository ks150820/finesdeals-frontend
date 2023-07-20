import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as actions from "../actions/api";

export const slice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productDetail: {},
    adminProducts: [],
    error: {},
    product: {
      success: false,
      productData: {},
    },
    reviews: [],
    deleteReviewStatus: false,
    isLoading: false,
    isProductDeleted: false,
    isProductEdit: false,
  },
  reducers: {
    onStartApiCall: (product, { payload }) => {
      product.isLoading = true;
    },
    onSuccessApiCall: (product, { payload }) => {
      product.products = payload?.data || [];
      product.isLoading = false;
    },
    onFailedApiResponse: (product, { payload }) => {
      product.error = payload?.data;
      product.isLoading = false;
    },
    onProductDetailApiStart: (product, { payload }) => {
      product.isLoading = true;
    },
    onProductDetailApiSuccess: (product, { payload }) => {
      product.productDetail = payload?.data?.product;
      product.isLoading = false;
    },
    onProductDetailApiFail: (product, { payload }) => {
      product.isLoading = false;
      product.error = payload?.data;
    },
    clearError: (product, { payload }) => {
      product.error = {};
    },
    adminProductsApiStart: (product, {payload}) => {},
    adminProductApiResponse: (product, {payload}) => {
      console.log('admin products ==>>', payload?.data);
      product.adminProducts = payload?.data?.products;
    },
    adminProductApiFailed: (product, {payload}) => {
      product.isLoading = false;
      product.error = payload?.data;
    },
    startCallingCreateProductApi: (product) => {
      product.isLoading = true;
    },
    createProductApiResponse: (product, {payload}) => {
      product.product.success = payload?.data?.success;
      product.product.productData = payload?.data?.product;
      product.isLoading = false;
    },
    createProductApiFailed: (product, {payload}) => {
      product.error = payload?.data;
      product.isLoading = false;
    },
    resetNewProduct: (product, {payload}) => {
      product.product.success = false;
      product.product.productData = {};
    },
    startProductDeleteApi: (product, {payload}) => {},
    productDeleteApi: (product, {payload}) => {
      console.log('delete product ==>>', payload?.data);
      product.isProductDeleted = payload?.data?.success;
    },
    productDeleteApiFailed: (product, {payload}) => {
      product.error = payload?.data;
    },
    resetDeleteProductStatus: (product, {payload}) => {
      product.isProductDeleted = false;
    },
    editProductApiStart: () => {},
    editProductApiSuccess: (product, {payload}) => {
      product.isProductEdit = payload?.data?.success;
    },
    editProductFailed: () => {},
    resetEditProductStatus: (product, {payload}) => {
      product.isProductEdit = false;
    },
    reviewApiStart: () => {},
    reviewApiResponse: (product, {payload}) => {
      console.log('reviews payload ==>>', payload?.data);
      product.reviews = payload?.data?.reviews;
    },
    reviewApiFailed: () => {},
    deleteReviewApiStart: () => {},
    deleteReviewApiResponse: (product, {payload}) => {
      product.deleteReviewStatus = payload?.data?.success;
    },
    deleteReviewApiFailed: () => {},
    resetDeleteReviewStatus: (product) => {
      product.deleteReviewStatus = false;
    }
  },
});

export const {
  onSuccessApiCall,
  onStartApiCall,
  onFailedApiResponse,
  clearError,
  onProductDetailApiStart,
  onProductDetailApiSuccess,
  onProductDetailApiFail,
  adminProductsApiStart,
  adminProductApiResponse,
  adminProductApiFailed,
  startCallingCreateProductApi,
  createProductApiResponse,
  createProductApiFailed,
  resetNewProduct,
  startProductDeleteApi,
  productDeleteApi,
  productDeleteApiFailed,
  resetDeleteProductStatus,
  editProductApiStart,
  editProductApiSuccess,
  editProductFailed,
  resetEditProductStatus,
  reviewApiStart,
  reviewApiResponse,
  reviewApiFailed,
  deleteReviewApiStart,
  deleteReviewApiResponse,
  deleteReviewApiFailed,
  resetDeleteReviewStatus
} = slice.actions;

export default slice.reducer;

export const getAllProducts = createSelector(
  (state) => state.entities.product,
  (product) => product.products
);

export const getProductDeleted = createSelector(
  (state) => state.entities.product,
  (product) => product.isProductDeleted,
);

export const getLoadingState = createSelector(
  (state) => state.entities.product,
  (loader) => loader.isLoading
);

export const getErrors = createSelector(
  (state) => state.entities.product,
  (error) => error.error
);

export const getProductDetail = createSelector(
  (state) => state.entities.product,
  (detail) => detail.productDetail
);

export const getAdminProducts = createSelector(
  (state) => state.entities.product,
  (products) => products.adminProducts
);

export const getNewCreatedProductDetails = createSelector(
  (state) => state.entities.product,
  (products) => products.product
);

export const getUpdateProductStatus = createSelector(
  (state) => state.entities.product,
  (products) => products.isProductEdit,
);

export const clearErrors = () => (dispatch) => {
  return dispatch({ type: onProductDetailApiFail.type, payload: { data: {} } });
};

export const updateClearError = () => (dispatch) => {
  return dispatch({ type: clearError.type, payload: {} });
};

export const resetCreatedNewProduct = () => (dispatch) => {
  return dispatch({type: resetNewProduct.type});
}

export const resetProductDeleteStatus = () => (dispatch) => {
  return dispatch({type: resetDeleteProductStatus.type});
}

export const resetProductUpdateStatus = () => (dispatch) => {
  return dispatch({type: resetEditProductStatus.type});
}

export const startCallingGetAllProductsApi =
  (keyword = "", currentPage = 1, price = [0, 25000], category, ratings = 0) =>
  (dispatch) => {
    let link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    if(category){
      link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    }
    return dispatch(
      actions.apiCallBegan({
        url: link,
        onStart: onStartApiCall.type,
        onError: onFailedApiResponse.type,
        reducerData: { page: "page" },
        onSuccess: onSuccessApiCall.type,
      })
    );
  };

export const startCallingProductDetailApi = (productId) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/product/${productId}`,
      onStart: onProductDetailApiStart.type,
      onError: onProductDetailApiFail.type,
      reducerData: { page: "product detail" },
      onSuccess: onProductDetailApiSuccess.type,
    })
  );
};

export const startCallingAdminProductsApi = () => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/products`,
      onStart: adminProductsApiStart.type,
      onError: adminProductApiFailed.type,
      onSuccess: adminProductApiResponse.type,
      method: "GET",
    })
  );
};

export const startCreateProductApi = (product) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/product/new`,
      onStart: startCallingCreateProductApi.type,
      onSuccess: createProductApiResponse.type,
      onError: createProductApiFailed.type,
      headers: {
        "Content-Type": "application/json"
      },
      data: product,
      method: "POST",
    })
  );
};

export const deleteProduct = (id) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/product/${id}`,
      onStart: startProductDeleteApi.type,
      onSuccess: productDeleteApi.type,
      onError: productDeleteApiFailed.type,
      method: "DELETE",
    })
  );
};

export const editProduct = (id, productData) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/products/${id}`,
      onStart: editProductApiStart.type,
      onSuccess: editProductApiSuccess.type,
      onError: editProductFailed.type,
      data: productData,
      method: "PUT",
    })
  );
};

export const callReviewsApi = (id) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/reviews?id=${id}`,
      onStart: reviewApiStart.type,
      onSuccess: reviewApiResponse.type,
      onError: reviewApiFailed.type,
      method: "GET",
    })
  );
};

export const callToDeleteReview = (id, productId) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/reviews?id=${id}&productId=${productId}`,
      onStart: deleteReviewApiStart.type,
      onSuccess: deleteReviewApiResponse.type,
      onError: deleteReviewApiFailed.type,
      method: "DELETE",
    })
  );
};

export const getAllReviews = createSelector(
  (state) => state.entities.product,
  (products) => products.reviews,
)

export const getReviewsDeletedStatus = createSelector(
  (state) => state.entities.product,
  (products) => products.deleteReviewStatus,
)

export const resetDeleteProductReviewStatus = () => (dispatch) => {
  return dispatch({type: resetDeleteReviewStatus.type});
}
