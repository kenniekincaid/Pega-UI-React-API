import { actionTypes } from "./actionTypes";
import { dataPageService } from "../_services";
import { alertActions } from "./";

/**
 * Action creators. Used to dispatch actions with Redux.
 * Actions can be simple [assignmentActions.closeAssignment()] or
 * complex to handle AJAX requests [assignmentActions.getAssignment()].
 * For actions that include AJAX requests, we dispatch two actions:
 *  -request (in case we need to update store on request initiation)
 *  -success OR failure (to update store with relevant response data)
 */
export const workQueueActions = {
  getWorkList,
  getWorkQueue
};

function getWorkList() {
  return dispatch => {
    dispatch(request());

    return dataPageService.getDataPage("D_Worklist", { Work: true }).then(
      worklist => {
        dispatch(success(worklist));
      },
      error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  function request() {
    return { type: actionTypes.WORKLIST_REQUEST };
  }
  function success(worklist) {
    return { type: actionTypes.WORKLIST_SUCCESS, worklist };
  }
  function failure(error) {
    return { type: actionTypes.WORKLIST_FAILURE, error };
  }
}

function getWorkQueue(basketId) {
  return dispatch => {
    dispatch(request(basketId));

    return dataPageService
      .getDataPage("D_WorkBasket", { WorkBasket: basketId })
      .then(
        workqueue => {
          dispatch(success(basketId, workqueue));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() {
    return { type: actionTypes.WORKQUEUE_REQUEST, basketId };
  }
  function success(basketId, workqueue) {
    return { type: actionTypes.WORKQUEUE_SUCCESS, basketId, workqueue };
  }
  function failure(error) {
    return { type: actionTypes.WORKQUEUE_FAILURE, error };
  }
}
