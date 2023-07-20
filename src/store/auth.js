import { combineReducers, createSelector, createSlice } from "@reduxjs/toolkit";
import * as actions from "./actions/api";

export const slice = createSlice({
  name: "auth",
  initialState: {
    token: '',
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: {},
    isUpdated: false,
    forgotPasswordMessage: null,
    resetSuccess: false,
    adminUserDetails: [],
    adminSingleUserDetail: {},
    updateAdminUserStatus: false,
    deleteAdminUserStatus: false,
  },
  reducers: {
    onStartLoginApiCall: (auth, { payload }) => {
      auth.error = {};
      auth.isLoading = true;
      auth.isAuthenticated = false;
    },
    onSuccessLoginApiCall: (auth, { payload }) => {
      auth.user = payload?.data?.user || {};
      auth.token = payload?.data?.token;
      auth.isAuthenticated = true;
      auth.isLoading = false;
      auth.error = {};
    },
    onFailedLoginApiResponse: (auth, { payload }) => {
      auth.isLoading = false;
      auth.user = null;
      auth.token = '';
      auth.isAuthenticated = false;
      auth.error = payload?.data;
    },
    onStartLogoutApi: (auth) => {
      auth.error = {};
    },
    onSuccessLogoutApi: () => {},
    onFailedLogoutApi: () => {},
    clearErrors: (auth, { payload }) => {
      auth.error = {};
    },
    updateLogout: (auth) => {
      auth.isAuthenticated = false;
      auth.user = null;
    },
    updateProfileApiStart: (auth, {payload}) => {
      auth.error = {};
      auth.isLoading = true;
      auth.isUpdated = false;
    },
    updateProfileApiSuccess: (auth, {payload}) => {
      auth.isUpdated = payload?.data?.success;
      auth.isLoading = false;
    },
    updateProfileApiFailed: (auth, {payload}) => {
      auth.error = payload?.data;
      auth.isUpdated = false;
      auth.isLoading = false;
    },
    resetUpdated: (auth) => {
      auth.isUpdated = false;
    },
    forgotPasswordApiStart: (auth) => {
      auth.error = {};
      auth.isLoading = true;
    },
    forgotPasswordApiSuccess: (auth, {payload}) => {
      auth.forgotPasswordMessage = payload?.data?.message;
      auth.isLoading = false;
    },
    forgotPasswordFailed: (auth, {payload}) => {
      auth.isLoading = false;
      auth.error = payload?.data;
    },
    resetPasswordApiStart: (auth) => {
      auth.error = {};
      auth.isLoading = true;
    },
    resetPasswordApiSuccess: (auth, {payload}) => {
      console.log('payload reset =>>>', payload?.data);
      auth.resetSuccess = payload?.data.success;
      auth.isLoading = false;
    },
    resetPasswordApiFailed: (auth, {payload}) => {
      auth.error = payload?.data;
      auth.isLoading = false;
    },
    adminUserDetailsApiStart: (auth, {payload}) => {},
    adminUserDetailsApiResponse: (auth, {payload}) => {
      console.log('admin users details =>>', payload?.data);
      auth.adminUserDetails = payload?.data?.users;
    },
    adminUserDetailsApiFailed: (auth, {payload}) => {},
    getSingleAdminUserDetailApiStart: (auth, {payload}) => {},
    getSingleAdminUserDetailApiResponse: (auth, {payload}) => {
      console.log("single user payload ==>>", payload?.data);
      auth.adminSingleUserDetail = payload?.data?.user;
    },
    getSingleAdminUserDetailsApiFailed: (auth, {payload}) => {},
    updateAdminUserDetailStart: (auth, {payload}) => {},
    updateAdminUserDetailResponse: (auth, {payload}) => {
      auth.updateAdminUserStatus = payload?.data?.success;
    },
    updateAdminUserDetailFailed: (auth, {payload}) => {},
    resetUpdateAdminUserDetail:(auth, {payload}) => {
      auth.updateAdminUserStatus = false;
    },
    deleteAdminUserApiStart: (auth, {payload}) => {},
    deleteAdminUserApiResponse: (auth, {payload}) => {
      auth.deleteAdminUserStatus = payload?.data?.success;
    },
    deleteAdminUserApiFailed: (auth, {payload}) => {},
    resetDeleteAdminUserStatus: (auth, {payload}) => {
      auth.deleteAdminUserStatus = false;
    },
  },
});

export const {
  onStartLoginApiCall,
  onSuccessLoginApiCall,
  onFailedLoginApiResponse,
  clearErrors,
  updateLogout,
  updateProfileApiStart,
  updateProfileApiSuccess,
  updateProfileApiFailed,
  resetUpdated,
  onStartLogoutApi,
  onSuccessLogoutApi,
  onFailedLogoutApi,
  forgotPasswordApiStart,
  forgotPasswordApiSuccess,
  forgotPasswordFailed,
  resetPasswordApiStart,
  resetPasswordApiSuccess,
  resetPasswordApiFailed,
  adminUserDetailsApiStart,
  adminUserDetailsApiResponse,
  adminUserDetailsApiFailed,
  updateAdminUserDetailStart,
  updateAdminUserDetailResponse,
  resetUpdateAdminUserDetail,
  updateAdminUserDetailFailed,
  deleteAdminUserApiStart,
  deleteAdminUserApiResponse,
  deleteAdminUserApiFailed,
  getSingleAdminUserDetailApiStart,
  getSingleAdminUserDetailApiResponse,
  getSingleAdminUserDetailsApiFailed,
  resetDeleteAdminUserStatus
} = slice.actions;

export default slice.reducer;

export const callResetPasswordApi = (data, token) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/password/reset/${token}`,
      onStart: resetPasswordApiStart.type,
      onSuccess: resetPasswordApiSuccess.type,
      onError: resetPasswordApiFailed.type,
      data,
      headers: {"Content-Type": "application/json"},
      method: "PUT"
    })
  )
}
 
export const callForgotPasswordApi = (email) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: '/password/forgot',
      onStart: forgotPasswordApiStart.type,
      onSuccess: forgotPasswordApiSuccess.type,
      onError: forgotPasswordFailed.type,
      data: email,
      headers: {"Content-Type": "application/json"},
      method: "POST",
    })
  )
}

export const callLoginApi = (email, password) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/login",
      data: {email: email, password: password},
      onStart: onStartLoginApiCall.type,
      onSuccess: onSuccessLoginApiCall.type,
      onError: onFailedLoginApiResponse.type,
      headers: {"Content-Type": "application/json"},
      method: "POST",
    })
  );
};

export const callLogoutApi = () => (dispatch) =>  {
  return dispatch(
    actions.apiCallBegan({
      url: '/logout',
      onStart:onStartLogoutApi.type,
      onSuccess: updateLogout.type,
      onError: onFailedLogoutApi.type,
      method: "GET"
    })
  )
};

export const loadUser = () => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/me",
      onStart: onStartLoginApiCall.type,
      onSuccess: onSuccessLoginApiCall.type,
      onError: onFailedLoginApiResponse.type,
      headers: {"Content-Type": "application/json"},
      method: "GET",
    })
  );
}

export const callRegisterApi = (userData) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/register",
      data: userData,
      onStart: onStartLoginApiCall.type,
      onSuccess: onSuccessLoginApiCall.type,
      onError: onFailedLoginApiResponse.type,
      headers: { "Content-Type": "multipart/form-data" },
      method: "POST",
    })
  )
}

export const callUpdateProfileApi = (data) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/me/update",
      data,
      onStart: updateProfileApiStart.type,
      onSuccess: updateProfileApiSuccess.type,
      onError: updateProfileApiFailed.type,
      headers: { "Content-Type": "multipart/form-data" },
      method: "PUT",
    })
  )
}

export const callUpdatePasswordApi = (data) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/password/update",
      data,
      onStart: updateProfileApiStart.type,
      onSuccess: updateProfileApiSuccess.type,
      onError: updateProfileApiFailed.type,
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    })
  )
}

// get all admin users
export const callToGetAllAdminUserDetails = () => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: "/admin/users",
      onStart: adminUserDetailsApiStart.type,
      onSuccess: adminUserDetailsApiResponse.type,
      onError: adminUserDetailsApiFailed.type,
      headers: {"Content-Type": "application/json"},
      method: "GET",
    })
  )
}

//get single admin user details
export const callToGetSingleAdminUserDetails = (id) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/user/${id}`,
      onStart: getSingleAdminUserDetailApiStart.type,
      onSuccess: getSingleAdminUserDetailApiResponse.type,
      onError: getSingleAdminUserDetailsApiFailed.type,
      headers: {"Content-Type": "application/json"},
      method: "GET",
    })
  )
}

// update single admin user
export const callToUpdateAdminUsers = (id, userData) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/user/${id}`,
      onStart: updateAdminUserDetailStart.type,
      onSuccess: updateAdminUserDetailResponse.type,
      onError: updateAdminUserDetailFailed.type,
      data: userData,
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    })
  )
}

// delete admin user
export const callToDeleteAdminUsers = (id) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/admin/user/${id}`,
      onStart: deleteAdminUserApiStart.type,
      onSuccess: deleteAdminUserApiResponse.type,
      onError: deleteAdminUserApiFailed.type,
      method: "DELETE",
    })
  )
}

export const resetErrors = () => (dispatch) => {
  return dispatch({ type: clearErrors.type });
};

// get single admin user details
export const getSingleAdminUserDetail = createSelector(
  (state) => state.auth,
  (auth) => auth.adminSingleUserDetail,
)

// get admin update status
export const getAdminUpdateUserStatus = createSelector(
  (state) => state.auth,
  (auth) => auth.updateAdminUserStatus,
)

// get admin delete user status
export const getAdminDeletedUserStatus = createSelector(
  (state) => state.auth,
  (auth) => auth.deleteAdminUserStatus,
)

// get all admin user details
export const getAllAdminUserDetails = createSelector(
  (state) => state.auth,
  (auth) => auth.adminUserDetails,
)

export const getResetSuccess = createSelector(
  (state) => state.auth,
  (auth) => auth.resetSuccess,
)

export const getUserDetails = createSelector(
  (state) => state.auth,
  (auth) => auth.user
);

export const getErrorDetails = createSelector(
  (state) => state.auth,
  (auth) => auth.error
);

export const getUserIsAuthenticated = createSelector(
  (state) => state.auth,
  (auth) => auth.isAuthenticated
);

export const getAuthLoadingState = createSelector(
  (state) => state.auth,
  (auth) => auth.isLoading,
)

export const getForgotPasswordSuccessMessage = createSelector(
  (state) => state.auth,
  (auth) => auth.forgotPasswordMessage,
)

export const getIsUpdated = createSelector(
  (state) => state.auth,
  (auth) => auth.isUpdated,
)

// reset admin update status
export const resetAdminUpdateStatus = () => (dispatch) => {
  return dispatch({type: resetUpdateAdminUserDetail.type});
}

// reset admin delete status
export const resetAdminDeleteStatus = () => (dispatch) => {
  return dispatch({type: resetDeleteAdminUserStatus.type});
}

export const userLogout = () => (dispatch) => {
  return dispatch({type: updateLogout.type});
}

export const resetProfileUpdated = () => (dispatch) => {
  return dispatch({type: resetUpdated.type});
}