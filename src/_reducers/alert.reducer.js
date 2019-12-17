import { actionTypes } from "../_actions";

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
export function alert(state = { activeAlerts: [] }, action) {
  switch (action.type) {
    case actionTypes.ALERT_SUCCESS:
      return {
        activeAlerts: [
          ...state.activeAlerts,
          {
            positive: true,
            negative: false,
            message: action.message,
            code: action.ID,
            id: new Date().getTime()
          }
        ]
      };
    case actionTypes.ALERT_ERROR:
      return {
        activeAlerts: [
          ...state.activeAlerts,
          {
            positive: false,
            negative: true,
            type: "alert-danger",
            message: action.message,
            code: action.ID,
            id: new Date().getTime()
          }
        ]
      };
    case actionTypes.ALERT_CLOSE:
      let close_index = state.activeAlerts.findIndex(x => x.id === action.id);

      return {
        activeAlerts: [
          ...state.activeAlerts.slice(0, close_index),
          ...state.activeAlerts.slice(close_index + 1)
        ]
      };
    default:
      return state;
  }
}
