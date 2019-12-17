import { combineReducers } from "redux";
import { user } from "./user.reducer";
import { alert } from "./alert.reducer";
import { cases } from "./case.reducer";
import { assignments } from "./assignment.reducer";
import { workqueue } from "./workqueue.reducer";
import { error } from "./error.reducer";
import { actionTypes } from "../_actions";

const appReducer = combineReducers({
  user,
  alert,
  cases,
  assignments,
  workqueue,
  error
});

export const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};
