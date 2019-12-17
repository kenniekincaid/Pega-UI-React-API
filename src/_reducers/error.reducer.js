import { actionTypes } from "../_actions";

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
const errorDefaultState = {
  validationErrors: {}
};

export function error(state = errorDefaultState, action) {
  switch (action.type) {
    case actionTypes.VALIDATION_ERROR:
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.caseID]: action.error
        }
      };
    case actionTypes.CLEAR_ERRORS:
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.caseID]: null
        }
      };
    default:
      return state;
  }
}
