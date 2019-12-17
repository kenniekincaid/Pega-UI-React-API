import _ from "lodash";

import { actionTypes } from "../_actions";

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
const casesDefaultState = {
  allCases: {},
  caseDetails: {},
  caseTypes: [],
  openCases: [],
  pages: {},
  caseViews: {}
};

export function cases(state = casesDefaultState, action) {
  switch (action.type) {
    case actionTypes.CASETYPES_REQUEST:
      return {
        ...state
      };
    case actionTypes.CASETYPES_SUCCESS:
      return {
        ...state,
        caseTypes: action.caseTypes
      };
    case actionTypes.CASETYPES_FAILURE:
      return state;
    case actionTypes.CASE_CREATION_PAGE_SUCCESS:
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.id]: action.data.creation_page
        }
      };
    case actionTypes.CASES_REQUEST:
      return {
        ...state,
        loadingCases: true
      };
    case actionTypes.CASES_SUCCESS:
      return {
        ...state,
        loadingCases: false,
        allCases: _.keyBy(action.cases, o => o.caseID)
      };
    case actionTypes.CASES_FAILURE:
      return {
        ...state,
        loadingCases: false,
        allCases: []
      };
    case actionTypes.CASE_REQUEST:
      return {
        ...state,
        loadingCase: true
      };
    case actionTypes.CASE_SUCCESS:
      let targetCase =
        action.aCase.cases && action.aCase.cases.length === 1
          ? action.aCase.cases[0]
          : action.aCase;
      let successIndex = state.openCases.findIndex(x => x === targetCase.ID);

      return {
        ...state,
        loadingCase: false,
        caseDetails: {
          ...state.caseDetails,
          [targetCase.ID]: targetCase
        },
        openCases:
          successIndex === -1
            ? [...state.openCases, targetCase.ID]
            : [
                ...state.openCases.slice(0, successIndex),
                ...state.openCases.slice(successIndex + 1),
                targetCase.ID
              ]
      };
    case actionTypes.CASE_FAILURE:
      return {
        ...state,
        loadingCase: false
      };
    case actionTypes.CASE_CLOSED:
      let close_index = state.openCases.findIndex(x => x === action.id);

      return {
        ...state,
        openCases: [
          ...state.openCases.slice(0, close_index),
          ...state.openCases.slice(close_index + 1)
        ]
      };
    case actionTypes.CASE_REFRESH_REQUEST:
      return state;
    case actionTypes.CASE_REFRESH_SUCCESS:
      let targetRefreshCase =
        action.aCase.cases && action.aCase.cases.length === 1
          ? action.aCase.cases[0]
          : action.aCase;

      return {
        ...state,
        caseDetails: {
          ...state.caseDetails,
          [targetRefreshCase.ID]: targetRefreshCase
        }
      };
    case actionTypes.CASE_REFRESH_FAILURE:
      return state;
    case actionTypes.CASE_PAGE_REQUEST:
      return state;
    case actionTypes.CASE_PAGE_SUCCESS:
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.caseID]: action.data
        }
      };
    case actionTypes.CASE_PAGE_FAILURE:
      return state;
    case actionTypes.CASE_VIEW_REQUEST:
      return state;
    case actionTypes.CASE_VIEW_SUCCESS:
      return {
        ...state,
        caseViews: {
          ...state.caseViews,
          [action.caseID]: action.data
        }
      };
    case actionTypes.CASE_VIEW_FAILURE:
      return state;
    case actionTypes.REMOVE_PAGE:
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.caseID]: null
        }
      };
    default:
      return state;
  }
}
