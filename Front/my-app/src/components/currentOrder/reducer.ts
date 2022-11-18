import { CurrentOrderState } from "./types.ts";

const initialState : CurrentOrderState = {
  currentOrder: undefined,
    selected: false
}

export const currentOrderReducer = (state = initialState, action: any): CurrentOrderState => {
    switch (action.type) {
      case "CLEAR_CURRENT_ORDER":
        return {
          ...state,
          selected: false,
          currentOrder: undefined
        };
      case "SET_CURRENT_ORDER":
        return {
          ...state,
          selected: true,
          currentOrder: action.payload,
        };
    }
    return state
  };