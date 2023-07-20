import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as actions from "../actions/api";

export const slice = createSlice({
  name: "order",
  initialState: {
    orders: {},
    error: {},
    isLoading: false,
    myOrders: [],
    orderDetails: {},
    adminAllOrders: [],
    isOrderDeleted: false,
    isOrderUpdated: false,
  },
  reducers: {
    onStartOrdersApi: (order) => {
      order.isLoading = true;
    },
    onSuccessOrdersApi: (order, { payload }) => {
      order.orders = payload?.data;
      order.isLoading = false;
    },
    onFailedOrdersApi: (order, { payload }) => {
      order.error = payload?.data?.order;
      order.isLoading = false;
    },
    clearErrors: (order) => {
      order.error = {};
    },
    startMyOrdersApi: (order) => {
        order.isLoading = true;
    },
    myOrderApiResponse: (order, {payload}) => {
        order.myOrders = payload?.data?.orders;
        order.isLoading = false;
    },
    myOrdersApiFailed: (order, {payload}) => {
        order.isLoading = false;
        order.error = payload?.data;
    },
    orderDetailsApiStart: (order) => {
      order.isLoading = true;
    },
    orderDetailsApiSuccess: (order, {payload}) => {
      order.orderDetails = payload?.data?.order;
      order.isLoading =false;
    },
    orderDetailsApiFailed: (order, {payload}) => {
      order.isLoading = false;
      order.error = payload?.data;
    },
    adminOrdersApiStart: (order, {payload}) => {},
    adminOrdersApiResponse: (order, {payload}) => {
      order.adminAllOrders = payload?.data?.orders;
    },
    adminOrdersApiFailed: (order, {payload}) => {},
    adminOrderDeletedApiStart: (order, {payload}) => {},
    adminORderDeleteApiResponse: (order, {payload}) => {
      order.isOrderDeleted = payload?.data?.success;
    },
    adminOrderDeleteApiFailed: (order, {payload}) => {},
    resetAdminOrderDeleteStatus: (order) => {
      order.isOrderDeleted = false
    },
    updateAdminOrdersApiStart: () => {},
    updateAdminOrdersApiResponse: (orders, {payload}) => {
      orders.isOrderUpdated = payload?.data?.success;
    },
    updateAdminOrdersApiFailed: () => {},
    resetUpdateAdminOrdersStatus: (orders) => {
      orders.isOrderUpdated = false;
    }
  },
});

export const {
  onStartOrdersApi,
  onSuccessOrdersApi,
  onFailedOrdersApi,
  clearErrors,
  startMyOrdersApi,
  myOrderApiResponse,
  myOrdersApiFailed,
  orderDetailsApiStart,
  orderDetailsApiSuccess,
  orderDetailsApiFailed,
  adminOrdersApiStart,
  adminOrdersApiResponse,
  adminOrdersApiFailed,
  adminOrderDeletedApiStart,
  adminORderDeleteApiResponse,
  adminOrderDeleteApiFailed,
  resetAdminOrderDeleteStatus,
  updateAdminOrdersApiStart,
  updateAdminOrdersApiResponse,
  updateAdminOrdersApiFailed,
  resetUpdateAdminOrdersStatus
} = slice.actions;

export default slice.reducer;

export const callOrdersApi = (order) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/order/new",
      onStart: onStartOrdersApi.type,
      onSuccess: onSuccessOrdersApi.type,
      onError: onFailedOrdersApi.type,
      headers: {
        "Content-Type": "application/json",
      },
      data: {...order},
      method: "POST",
    })
  );
};

export const callMyOrdersApi = () => (dispatch) => {
    return dispatch(
        actions.apiCallBegan({
            url: '/orders/me',
            onStart: startMyOrdersApi.type,
            onSuccess: myOrderApiResponse.type,
            onError: myOrdersApiFailed.type,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              },
        })
    )
}

export const callMyOrderDetailApi = (id) => (dispatch) => {
  return dispatch(
      actions.apiCallBegan({
          url: `/order/${id}`,
          onStart: orderDetailsApiStart.type,
          onSuccess: orderDetailsApiSuccess.type,
          onError: orderDetailsApiFailed.type,
          method: "GET",
          headers: {
              "Content-Type": "application/json",
            },
      })
  )
}

export const callToGetAllAdminOrders = () => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: '/admin/orders',
      onStart: adminOrdersApiStart.type,
      onSuccess: adminOrdersApiResponse.type,
      onError: adminOrdersApiFailed.type,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  )
}
export const callToDeleteOrder = (id) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/order/${id}`,
      onStart: adminOrderDeletedApiStart.type,
      onSuccess: adminORderDeleteApiResponse.type,
      onError: adminOrderDeleteApiFailed.type,
      method: "DELETE",
    })
  );
};

export const callToUpdateAdminOrders = (id, order) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/order/${id}`,
      onStart: updateAdminOrdersApiStart.type,
      onSuccess: updateAdminOrdersApiResponse.type,
      onError: updateAdminOrdersApiFailed.type,
      data: order,
      method: "PUT",
    })
  );
};

export const clearError = () => (dispatch) => {
    return dispatch({type: clearErrors.type});
}

export const resetOrderDeletedStatus = () => (dispatch) => {
  return dispatch({type: resetAdminOrderDeleteStatus.type});
}

export const resetOrderUpdateStatus = () => (dispatch) => {
  return dispatch({type: resetUpdateAdminOrdersStatus.type});
}

export const resetOrderUpdatedStatus = () => (dispatch) => {
  return dispatch({type: resetUpdateAdminOrdersStatus.type});
}

export const getOrderUpdatedStatus = createSelector(
  (state) => state.entities.order,
  (order) => order.isOrderUpdated
)

export const getError = createSelector(
    (state) => state.entities.order,
    (order) => order.error
)

export const getOrderDeletedStatus = createSelector(
  (state) => state.entities.order,
  (order) => order.isOrderDeleted
)

export const getAdminAllOrders = createSelector(
  (state) => state.entities.order,
  (order) => order.adminAllOrders,
)

export const geOrderDetails = createSelector(
  (state) => state.entities.order,
  (order) => order.orderDetails,
)

export const getAllMyOrders = createSelector(
    (state) => state.entities.order,
    (order) => order.myOrders,
)

export const getLoadingState = createSelector(
    (state) => state.entities.order,
    (loader) => loader.isLoading,
)
