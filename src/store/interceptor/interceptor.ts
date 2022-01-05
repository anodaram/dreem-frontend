import axios from "axios";
import URL from "shared/functions/getURL";
import { signOut } from "../actions/User";

const interceptor = store => {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      if (config.url!.startsWith(`${URL()}`)) {
        const state = store.getState();

        if (state.user.jwt) {
          config.headers["Authorization"] = "Bearer " + state.user.jwt;
        } else {
          let token: string = localStorage.getItem("token") || "";
          if (token) {
            config.headers["Authorization"] = "Bearer " + token;
          }
        }
      }

      // Do something before request is sent
      return config;
    },
    function (error) {
      console.log("privi axios request error");
      console.log(error);

      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      console.log("Axios response error");
      // Do something with response error
      if (error?.response?.status === 403) {
        console.log("403 ERROR AUTH JWT!");
        store.dispatch(signOut());
        localStorage.clear();
        window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );
};

export default {
  interceptor,
};
