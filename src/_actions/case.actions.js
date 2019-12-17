import { actionTypes } from "./actionTypes";
import { caseService } from "../_services";
import { alertActions } from "./";
import { assignmentActions, errorActions } from "./";

/**
 * Action creators. Used to dispatch actions with Redux.
 * Actions can be simple [assignmentActions.closeAssignment()] or
 * complex to handle AJAX requests [assignmentActions.getAssignment()].
 * For actions that include AJAX requests, we dispatch two actions:
 *  -request (in case we need to update store on request initiation)
 *  -success OR failure (to update store with relevant response data)
 */
export const caseActions = {
  getCaseTypes,
  getCaseCreationPage,
  createCase,
  getCase,
  refreshCase,
  closeCase,
  updateCase,
  getPage,
  removePage,
  getView,
  cases
};

function getCaseTypes() {
  return dispatch => {
    dispatch(request());

    caseService.getCaseTypes().then(
      caseTypes => {
        dispatch(success(caseTypes));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.CASETYPES_REQUEST };
  }
  function success(caseTypes) {
    return { type: actionTypes.CASETYPES_SUCCESS, caseTypes };
  }
  function failure(error) {
    return { type: actionTypes.CASETYPES_FAILURE, error };
  }
}

function getCaseCreationPage(id) {
  return dispatch => {
    dispatch(request(id));

    caseService.getCaseCreationPage(id).then(
      data => {
        dispatch(assignmentActions.addOpenAssignment(id));
        dispatch(success(id, data));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(id) {
    return { type: actionTypes.CASE_CREATION_PAGE_REQUEST, id };
  }
  function success(id, data) {
    return { type: actionTypes.CASE_CREATION_PAGE_SUCCESS, id, data };
  }
  function failure(error) {
    return { type: actionTypes.CASE_CREATION_PAGE_FAILURE, error };
  }
}

function createCase(id, content = {}) {
  return dispatch => {
    dispatch(request(id));

    return caseService.createCase(id, content).then(
      aCase => {
        dispatch(assignmentActions.closeAssignment(id));
        dispatch(assignmentActions.addOpenAssignment(aCase.ID));
        dispatch(getCase(aCase.ID));
        dispatch(assignmentActions.getAssignment(aCase.nextAssignmentID));

        return dispatch(success(aCase));
      },
      error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          error.response.data.errors.forEach(pegaError => {
            dispatch(errorActions.pegaError(id, pegaError));
          });
        }
        return dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.CASE_CREATE_REQUEST, id };
  }
  function success(aCase) {
    return { type: actionTypes.CASE_CREATE_SUCCESS, aCase };
  }
  function failure(error) {
    return { type: actionTypes.CASE_CREATE_FAILURE, error };
  }
}

function getCase(id) {
  return dispatch => {
    dispatch(request(id));

    return caseService.getCase(id).then(
      aCase => {
        return dispatch(success(aCase));
      },
      error => {
        dispatch(alertActions.error(error));
        dispatch(assignmentActions.closeAssignment(id));
        return dispatch(failure(error));
      }
    );
  };

  function request(id) {
    return { type: actionTypes.CASE_REQUEST, id };
  }
  function success(aCase) {
    return { type: actionTypes.CASE_SUCCESS, aCase };
  }
  function failure(error) {
    return { type: actionTypes.CASE_FAILURE, error };
  }
}

function refreshCase(id) {
  return dispatch => {
    dispatch(request(id));

    return caseService.getCase(id).then(
      aCase => {
        return dispatch(success(aCase));
      },
      error => {
        dispatch(alertActions.error(error));
        return dispatch(failure(error));
      }
    );
  };

  function request(id) {
    return { type: actionTypes.CASE_REFRESH_REQUEST, id };
  }
  function success(aCase) {
    return { type: actionTypes.CASE_REFRESH_SUCCESS, aCase };
  }
  function failure(error) {
    return { type: actionTypes.CASE_REFRESH_FAILURE, error };
  }
}

function closeCase(id) {
  return dispatch => dispatch({ type: actionTypes.CASE_CLOSED, id });
}

function updateCase(id, body, etag, action) {
  return dispatch => {
    dispatch(request(id));

    caseService.updateCase(id, body, etag, action).then(
      aCase => {
        dispatch(success(aCase));
        dispatch(caseActions.refreshCase(id));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(id) {
    return { type: actionTypes.CASE_UPDATE_REQUEST, id };
  }
  function success(aCase) {
    return { type: actionTypes.CASE_UPDATE_SUCCESS, aCase };
  }
  function failure(error) {
    return { type: actionTypes.CASE_UPDATE_FAILURE, error };
  }
}

function getPage(caseID, pageID) {
  return dispatch => {
    dispatch(request(caseID, pageID));

    caseService.getPage(caseID, pageID).then(
      data => {
        dispatch(success(caseID, data));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(caseID, pageID) {
    return { type: actionTypes.CASE_PAGE_REQUEST, caseID, pageID };
  }
  function success(caseID, data) {
    return { type: actionTypes.CASE_PAGE_SUCCESS, caseID, data };
  }
  function failure(error) {
    return { type: actionTypes.CASE_PAGE_FAILURE, error };
  }
}

function removePage(caseID) {
  return { type: actionTypes.REMOVE_PAGE, caseID };
}

function getView(caseID, viewID) {
  return dispatch => {
    dispatch(request(caseID, viewID));

    caseService.getView(caseID, viewID).then(
      data => {
        dispatch(success(caseID, data));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(caseID, viewID) {
    return { type: actionTypes.CASE_VIEW_REQUEST, caseID, viewID };
  }
  function success(caseID, data) {
    return { type: actionTypes.CASE_VIEW_SUCCESS, caseID, data };
  }
  function failure(error) {
    return { type: actionTypes.CASE_VIEW_FAILURE, error };
  }
}

function cases() {
  return dispatch => {
    dispatch(request());

    caseService.cases().then(
      cases => {
        dispatch(success(cases));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.CASES_REQUEST };
  }
  function success(cases) {
    return { type: actionTypes.CASES_SUCCESS, cases };
  }
  function failure(error) {
    return { type: actionTypes.CASES_FAILURE, error };
  }
}
