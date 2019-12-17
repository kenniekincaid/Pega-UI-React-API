import { actionTypes } from "./actionTypes";
import { assignmentService } from "../_services";
import { getError } from "../_helpers";
import { alertActions, caseActions, errorActions } from "./";

/**
 * Action creators. Used to dispatch actions with Redux.
 * Actions can be simple [assignmentActions.closeAssignment()] or
 * complex to handle AJAX requests [assignmentActions.getAssignment()].
 * For actions that include AJAX requests, we dispatch two actions:
 *  -request (in case we need to update store on request initiation)
 *  -success OR failure (to update store with relevant response data)
 */
export const assignmentActions = {
  getAssignment,
  getNextAssignment,
  getFieldsForAssignment,
  addOpenAssignment,
  refreshAssignment,
  closeAssignment,
  getAssignmentFromCaseId,
  performRefreshOnAssignment,
  performActionOnAssignment,
  assignments
};

function getAssignment(id) {
  return dispatch => {
    dispatch(request(id));

    return assignmentService.getAssignment(id).then(
      assignment => {
        if (assignment.actions && assignment.actions.length > 0) {
          // use then() to delay issuing ASSIGNMENT_SUCCESS until fields are returned
          dispatch(getFieldsForAssignment(assignment)).then(data => {
            return dispatch(success(assignment));
          });
        } else {
          dispatch(assignmentActions.closeAssignment(assignment.caseID));
          dispatch(
            alertActions.error(
              "Assignment does not have any actions configured."
            )
          );
          return dispatch(failure(assignment));
        }
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(id) {
    return { type: actionTypes.ASSIGNMENT_REQUEST, id };
  }
  function success(assignment) {
    return { type: actionTypes.ASSIGNMENT_SUCCESS, assignment };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENT_FAILURE, error };
  }
}

function getNextAssignment() {
  return dispatch => {
    dispatch(request());
    return assignmentService.getAssignment("next").then(
      assignment => {
        dispatch(assignmentActions.addOpenAssignment(assignment.caseID));
        dispatch(caseActions.getCase(assignment.caseID));
        dispatch(getFieldsForAssignment(assignment)).then(data => {
          return dispatch(success(assignment));
        });
      },
      error => {
        dispatch(alertActions.error(error));
        return dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.NEXT_ASSIGNMENT_REQUEST };
  }
  function success(assignment) {
    return { type: actionTypes.ASSIGNMENT_SUCCESS, assignment };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENT_FAILURE, error };
  }
}

function getFieldsForAssignment(assignment, actionId = null) {
  return dispatch => {
    dispatch(request(assignment, actionId));

    // Get view for case -- pyCaseDetails section to display alongside WorkObject.
    dispatch(caseActions.getView(assignment.caseID, "pyCaseDetails"));

    return assignmentService.getFieldsForAssignment(assignment, actionId).then(
      data => {
        return dispatch(success(data));
      },
      error => {
        dispatch(failure(error));
      }
    );
  };

  function request(assignment, actionId) {
    return {
      type: actionTypes.ASSIGNMENT_FIELDS_REQUEST,
      assignment,
      actionId
    };
  }
  function success(data) {
    return { type: actionTypes.ASSIGNMENT_FIELDS_SUCCESS, data };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENT_FIELDS_FAILURE, error };
  }
}

function addOpenAssignment(caseID) {
  return dispatch => {
    dispatch(caseActions.removePage(caseID));
    dispatch({ type: actionTypes.ADD_OPEN_ASSIGNMENT, caseID });
  };
}

function refreshAssignment(caseID, id, actionId = null) {
  return dispatch => {
    dispatch(request(caseID, id));

    return assignmentService.getAssignment(id).then(
      assignment => {
        return dispatch(getFieldsForAssignment(assignment, actionId)).then(
          data => {
            return dispatch(success(caseID, assignment));
          }
        );
      },
      error => {
        dispatch(alertActions.error(error));
        return dispatch(failure(caseID, error));
      }
    );
  };

  function request(caseID, id) {
    return { type: actionTypes.ASSIGNMENT_REFRESH_REQUEST, caseID, id };
  }
  function success(caseID, assignment) {
    return { type: actionTypes.ASSIGNMENT_REFRESH_SUCCESS, caseID, assignment };
  }
  function failure(caseID, error) {
    return { type: actionTypes.ASSIGNMENT_REFRESH_FAILURE, caseID, error };
  }
}

function performRefreshOnAssignment(caseID, assignmentID, actionID, body) {
  return dispatch => {
    dispatch(request(caseID, assignmentID, actionID, body));
    dispatch(errorActions.clearErrors(caseID));

    return assignmentService
      .performRefreshOnAssignment(assignmentID, actionID, body)
      .then(
        assignment => {
          dispatch(success(assignment));
        },
        error => {
          dispatch(alertActions.error(error));
          return dispatch(failure(error));
        }
      );
  };

  function request(caseID, assignmentId, actionID, body) {
    return {
      type: actionTypes.ASSIGNMENT_PERFORM_REFRESH_REQUEST,
      caseID,
      assignmentID,
      actionID,
      body
    };
  }
  function success(assignment) {
    return { type: actionTypes.ASSIGNMENT_PERFORM_REFRESH_SUCCESS, assignment };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENT_PERFORM_REFRESH_FAILURE, error };
  }
}

function performActionOnAssignment(caseID, assignmentID, actionID, body) {
  return dispatch => {
    dispatch(request(caseID, assignmentID, actionID, body));
    dispatch(errorActions.clearErrors(caseID));

    return assignmentService
      .performActionOnAssignment(assignmentID, actionID, body)
      .then(
        assignment => {
          if (assignment.nextAssignmentID) {
            dispatch(caseActions.refreshCase(caseID));
            return dispatch(
              refreshAssignment(caseID, assignment.nextAssignmentID)
            ).then(data => {
              return dispatch(
                success(caseID, assignment, data.assignment.actions[0].ID)
              );
            });
          } else {
            // Get view for case -- pyCaseDetails section to display alongside WorkObject.
            // We want to display this with confirm harness, but not New harness.
            dispatch(caseActions.getView(caseID, "pyCaseDetails"));
            // Get case info again, so that we can put status onto Confirm harness
            dispatch(caseActions.getCase(caseID));
            // Get harness for confirm
            dispatch(caseActions.getPage(caseID, assignment.nextPageID));
            return dispatch(success(caseID, assignment, null));
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            error.response.data.errors.forEach(pegaError => {
              dispatch(errorActions.pegaError(caseID, pegaError));
            });
          }
          return dispatch(failure(caseID, getError(error), actionID));
        }
      );
  };

  function request(caseID, assignmentId, actionID, body) {
    return {
      type: actionTypes.ASSIGNMENT_PERFORM_ACTION_REQUEST,
      caseID,
      assignmentID,
      actionID,
      body
    };
  }
  function success(caseID, assignment, nextActionID) {
    return {
      type: actionTypes.ASSIGNMENT_PERFORM_ACTION_SUCCESS,
      caseID,
      assignment,
      nextActionID
    };
  }
  function failure(caseID, error, nextActionID) {
    return {
      type: actionTypes.ASSIGNMENT_PERFORM_ACTION_FAILURE,
      caseID,
      error,
      nextActionID
    };
  }
}

function closeAssignment(id) {
  return { type: actionTypes.ASSIGNMENT_CLOSED, id };
}

function getAssignmentFromCaseId(id) {
  return dispatch => {
    dispatch(request(id));

    assignmentService.assignments().then(
      assignments => {
        let index = assignments.findIndex(x => x.caseID === id);

        if (index !== -1) {
          dispatch(success(assignments[index]));
          dispatch(assignmentActions.getAssignment(assignments[index].ID));
        } else {
          dispatch(failure("No matching assignment found."));
        }
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.ASSIGNMENT_FROM_CASE_REQUEST, id };
  }
  function success(assignment) {
    return { type: actionTypes.ASSIGNMENT_FROM_CASE_SUCCESS, assignment };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENT_FROM_CASE_FAILURE, error };
  }
}

function assignments() {
  return dispatch => {
    dispatch(request());

    assignmentService.assignments().then(
      assignments => {
        dispatch(success(assignments));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.ASSIGNMENTS_REQUEST };
  }
  function success(assignments) {
    return { type: actionTypes.ASSIGNMENTS_SUCCESS, assignments };
  }
  function failure(error) {
    return { type: actionTypes.ASSIGNMENTS_FAILURE, error };
  }
}
