import axios from "axios";
import { endpoints } from "./endpoints";
import { authHeader, getError } from "../_helpers";

/**
 * Functions used to issue AJAX requests and manage responses.
 * All of the included methods use the Axios library for Promise-based requests.
 */
export const dataPageService = {
  getDataPage
};

function getDataPage(id, params) {
  return axios
    .get(endpoints.BASEURL + endpoints.DATA + "/" + id, {
      headers: authHeader(),
      params: params
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}
