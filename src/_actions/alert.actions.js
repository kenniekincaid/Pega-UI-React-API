import { actionTypes } from "./actionTypes";

export const alertActions = {
  success,
  error,
  closeAlert
};

function success(message) {
  if (typeof message === "string") {
    return { type: actionTypes.ALERT_SUCCESS, message };
  } else {
    return { type: actionTypes.ALERT_SUCCESS, ...message };
  }
}

function error(message) {
  if (typeof message === "string") {
    return { type: actionTypes.ALERT_ERROR, message };
  } else {
    return { type: actionTypes.ALERT_ERROR, ...message };
  }
}

function closeAlert(id) {
  return { type: actionTypes.ALERT_CLOSE, id };
}
