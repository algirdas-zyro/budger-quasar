import Vue from "vue";
import axios from "axios";

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const CHECK_LOCALSTORAGE = "CHECK_LOCALSTORAGE";

Vue.prototype.$axios = axios;

console.log(process.env.API_URL);
axios.interceptors.request.use(config => ({
  ...config,
  baseURL: process.env.API_URL,
  headers: {
    ...config.headers,
    common: {
      Accept: "application/json"
    }
  }
}));
