import axios from "axios";
import { endpoints } from "./endpoints";
import { authHeader, getError } from "../_helpers";

/**
 * Functions used to issue AJAX requests and manage responses.
 * All of the included methods use the Axios library for Promise-based requests.
 */
export const userService = {
  login,
  logout,
  operator
};

function login(username, password) {
  const encodedUser = btoa(username + ":" + password);

  return axios
    .get(endpoints.BASEURL + endpoints.AUTH, {
      headers: { Authorization: "Basic " + encodedUser }
    })
    .then(function(response) {
      localStorage.setItem("user", encodedUser);
      return encodedUser;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function logout() {
  localStorage.removeItem("user");
}

function operator() {
  return axios
    .get(endpoints.BASEURL + endpoints.DATA + "/D_OperatorID", {
      headers: authHeader()
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}
