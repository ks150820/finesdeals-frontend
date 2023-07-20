import httpService from "../../services/httpSerivces";
import * as actions from "../actions/api";

const createRequest = (url, method = "get", data = null, headers = null) => {
  let request = {
    baseURL: "http://localhost:4000/api/v1",
    method,
    url,
    withCredentials: true,
  };

  if(headers){
    request.headers = headers;
  }

  request.data = data;

  return request;
};

const api =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    try {
      const {
        url,
        method,
        headers,
        data,
        onStart,
        onSuccess,
        onError,
        auth,
        reducerData,
        onSuccessCallback,
      } = action.payload;

      if (onStart)
        dispatch({ type: onStart, payload: { reducerData: reducerData } });

      next(action);

      // console.log('requests :', createRequest(url, method, data));

      httpService
        .request(createRequest(url, method, data, headers))
        .then((response) => {
          dispatch(actions.apiCallSuccess(response.data));

          if (onSuccess) {
            dispatch({
              type: onSuccess,
              payload: { data: response.data, reducerData: reducerData },
            });
          }

          if (onSuccessCallback) {
            onSuccessCallback({
              data: response.data,
              reducerData: reducerData,
            });
          }
        })
        .catch((error) => {
          console.log("ex", error?.response?.data);
          const errorResponse = error?.response?.data
            ? error?.response?.data
            : { message: error?.message, status: 400 };
          console.log("error response :", errorResponse);
          dispatch(actions.apiCallFailed(errorResponse || "network error"));
          // for specific case
          if (onError)
            dispatch({
              type: onError,
              payload: { data: errorResponse, reducerData: reducerData },
            });
        });
    } catch (ex) {
      console.log("error", ex);
    }
  };

export default api;
