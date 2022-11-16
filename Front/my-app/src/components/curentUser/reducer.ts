import { CurrentUserState } from "./types.ts";

const initialState : CurrentUserState = {
  currentUser: undefined,
    selected: false
}

export const currentUserReducer = (state = initialState, action: any): CurrentUserState => {
    switch (action.type) {
      case "CLEAR_CURRENT_USER":
        return {
          ...state,
          selected: false,
          currentUser: undefined
        };
      case "SET_CURRENT_USER":
        return {
          ...state,
          selected: true,
          currentUser: action.payload,
        };
    }
    return state
  };