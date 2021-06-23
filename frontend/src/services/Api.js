import axios from "axios";
import * as storageHelper from "../utils/local-storage-helper";
import ServerRouter from "./ServerRouter";

if (typeof window !== "undefined") {
  window.active_ajax = 0;
  axios.interceptors.request.use(
    function (config) {
      window.active_ajax += 1;
      return config;
    },
    function (error) {
      window.active_ajax += 1;
      console.log("errorrrrrrr11...", error);
      return error;
    }
  );

  axios.interceptors.response.use(
    function (response) {
      window.active_ajax -= 1;
      return response;
    },
    function (error) {
      window.active_ajax -= 1;
      if (
        error &&
        error.data &&
        error.data.statusCode &&
        error.data.statusCode === 401
      ) {
        console.log("unauthorized, logging out ...");
        storageHelper.setObj("userDetails", "");
      }
      return Promise.reject(error.response);
    }
  );
}

export default class Api {
  constructor(cookie_token) {
    let data = "";
    if (process.browser) {
      data = storageHelper.getObj("USER_DATA");
    }
    let id_token = cookie_token ? cookie_token : data ? data.auth_token : "";
    this.refresh_token = data ? data.refresh_token : "";
    this.id_token = typeof id_token === "undefined" ? "" : id_token;
  }

  getHeader = () => {
    return { Authorization: "Bearer " + this.id_token };
  };

  getFormDataHeader = () => {
    return {
      Authorization: "Bearer " + this.id_token,
      "Content-Type": "multipart/form-data",
    };
  };

  async send(options, timeout) {
      
    return axios({
      method: options.method,
      url: options.url,
      data: options.data,
      timeout: timeout ? timeout : 60000,
      headers: {
        ...options.headers
      },
    });
  }

  login(email, password) {
    return this.send({
      method: "post",
      url: `${ServerRouter.frontend()}oauth/token`,
      headers: {
        Authorization:
          "Basic " +
          "dm5razc3amgtOHBpaS13NWNuLThpM3Qtc3c5ZW85YXRsZGtwOlkyWDFZSjQyT09CQjkxR0owSE40NUMzVkhPVDE4UlcyVzQ4VFIyTFJNUEswNDBBSTNVUDQzRjVaSkJUWUhHN1k=",
      },
      data: {
        email_id: email,
        password: password,
        grant_type: "password",
      },
    });
  }

  signup(email, password) {
    return this.send({
      method: "post",
      url: `${ServerRouter.frontend()}user`,
      data: {
        email_id: email,
        password: password
      },
    });
  }

  add_todo(todo) {
    return this.send({
      method: "post",
      url: `${ServerRouter.frontend()}todo`,
      data: {
        todo: todo
      },
      headers: this.getHeader()
    });
  }

  get_goto_list() {
    return this.send({
      method: "get",
      url: `${ServerRouter.frontend()}get_todo`,
      headers: this.getHeader()
    });
  }

  delete_todo(todoID) {
    return this.send({
      method: "post",
      url: `${ServerRouter.frontend()}delete_todo`,
      data: {
        _id: todoID
      },
      headers: this.getHeader()
    });
  }
  
}
