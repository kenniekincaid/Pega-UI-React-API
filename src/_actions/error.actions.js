import { actionTypes } from "./actionTypes";
import { PegaErrors } from "../_constants";

/**
 * Action creators. Used to dispatch actions with Redux.
 * Actions can be simple [assignmentActions.closeAssignment()] or
 * complex to handle AJAX requests [assignmentActions.getAssignment()].
 * For actions that include AJAX requests, we dispatch two actions:
 *  -request (in case we need to update store on request initiation)
 *  -success OR failure (to update store with relevant response data)
 */
export const errorActions = {
  pegaError,
  clearErrors
};

function pegaError(caseID, error) {
  switch (error.ID) {
    case PegaErrors.VALIDATION_ERROR:
      return { type: actionTypes.VALIDATION_ERROR, caseID, error };
    case PegaErrors.NOT_AUTHORIZED:
      return { type: actionTypes.NOT_AUTHORIZED_ERROR, caseID, error };
    default:
      return { type: actionTypes.UNHANDLED_PEGA_ERROR, caseID, error };
  }
}

function clearErrors(caseID) {
  return { type: actionTypes.CLEAR_ERRORS, caseID };
}
