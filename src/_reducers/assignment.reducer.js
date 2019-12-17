import _ from "lodash";

import { actionTypes } from "../_actions";

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
const assignmentsDefaultState = {
  allAssignments: {},
  assignmentDetails: {},
  assignmentLoading: {},
  openAssignments: [],
  views: {},
  viewHeaders: {}
};

export function assignments(state = assignmentsDefaultState, action) {
  switch (action.type) {
    case actionTypes.ASSIGNMENTS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case actionTypes.ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        allAssignments: _.keyBy(action.assignments, o => o.caseID)
      };
    case actionTypes.ASSIGNMENTS_FAILURE:
      return {
        ...state,
        loading: false
      };
    case actionTypes.ASSIGNMENT_FIELDS_SUCCESS:
      return {
        ...state,
        views: {
          ...state.views,
          [action.data.caseID]: action.data.view
        },
        viewHeaders: {
          ...state.viewHeaders,
          [action.data.caseID]: action.data.name
        },
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.data.caseID]: false
        }
      };
    case actionTypes.ASSIGNMENT_PERFORM_REFRESH_SUCCESS:
      return {
        ...state,
        loading: false,
        views: {
          ...state.views,
          [action.assignment.caseID]: action.assignment.view
        },
        viewHeaders: {
          ...state.viewHeaders,
          [action.assignment.caseID]: action.assignment.name
        }
      };
    case actionTypes.ASSIGNMENT_REQUEST:
      return state;
    case actionTypes.ADD_OPEN_ASSIGNMENT:
      let successIndex = state.openAssignments.findIndex(
        x => x === action.caseID
      );

      return {
        ...state,
        openAssignments:
          successIndex === -1
            ? [...state.openAssignments, action.caseID]
            : [
                ...state.openAssignments.slice(0, successIndex),
                ...state.openAssignments.slice(successIndex + 1),
                action.caseID
              ]
      };
    case actionTypes.ASSIGNMENT_SUCCESS:
      return {
        ...state,
        assignmentDetails: {
          ...state.assignmentDetails,
          [action.assignment.caseID]: action.assignment
        }
      };
    case actionTypes.ASSIGNMENT_FAILURE:
      return state;
    case actionTypes.ASSIGNMENT_CLOSED:
      let close_index = state.openAssignments.findIndex(x => x === action.id);

      return {
        ...state,
        openAssignments: [
          ...state.openAssignments.slice(0, close_index),
          ...state.openAssignments.slice(close_index + 1)
        ]
      };
    case actionTypes.ASSIGNMENT_REFRESH_REQUEST:
      return {
        ...state,
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.caseID]: true
        }
      };
    case actionTypes.ASSIGNMENT_REFRESH_SUCCESS:
      return {
        ...state,
        assignmentDetails: {
          ...state.assignmentDetails,
          [action.assignment.caseID]: action.assignment
        },
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.caseID]: false
        }
      };
    case actionTypes.ASSIGNMENT_REFRESH_FAILURE:
      return {
        ...state,
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.caseID]: false
        }
      };
    case actionTypes.ASSIGNMENT_PERFORM_ACTION_REQUEST:
      return {
        ...state,
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.caseID]: true
        }
      };
    case actionTypes.ASSIGNMENT_PERFORM_ACTION_SUCCESS:
      return state;
    case actionTypes.ASSIGNMENT_PERFORM_ACTION_FAILURE:
      return {
        ...state,
        assignmentLoading: {
          ...state.assignmentLoading,
          [action.caseID]: false
        }
      };
    default:
      return state;
  }
}
