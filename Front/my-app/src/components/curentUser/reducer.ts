import { CurrentUserState } from "./types.ts";

const initialState : CurrentUserState = {
    user: undefined,
    selected: false
}

export const currentUserReducer = (state = initialState, action: any): CurrentUserState => {
    switch (action.type) {
      case "CLEAR_CURRENT_USER":
        return {
          ...state,
          selected: false,
          user: undefined
        };
      case "SET_CURRENT_USER":
        return {
          ...state,
          selected: true,
          user: action.payload,
        };
    }
    return state
  };