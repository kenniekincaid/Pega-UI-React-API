import { actionTypes } from "../_actions";

let storedUser = localStorage.getItem("user");
let initialState;

if (storedUser) {
  initialState = {
    loggedIn: true,
    storedUser,
    userData: {},
    recents: []
  };
} else {
  initialState = {
    loggedIn: false,
    storedUser: null,
    userData: {},
    recents: []
  };
}

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
export function user(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.user
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        user: null
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        user: null
      };
    case actionTypes.USER_DATA_REQUEST:
      // TODO: Handle user state after request is made, but no response received
      return state;
    case actionTypes.USER_DATA_SUCCESS:
      // TODO: Handle user state after successful call to user data page
      // Can store some data into state.userData
      return {
        ...state,
        userData: {
          ...state.userData,
          name: action.operator.pyLabel,
          id: action.operator.pyUserIdentifier,
          accessGroup: action.operator.pyAccessGroup,
          email: action.operator.pyAddresses.Email.pyEmailAddress,
          workbaskets: action.operator.pyWorkbasket
        }
      };

    case actionTypes.USER_DATA_FAILURE:
      // TODO: Handle user state after failed call to user data page
      return state;
    case actionTypes.RECENTS_SUCCESS:
      return {
        ...state,
        recents: action.data.pxResults.map(result => {
          return {
            label: result.pyLabel,
            id: result.pyRecordID,
            caseID: result.pyRecordKey
          };
        })
      };
    default:
      return state;
  }
}
