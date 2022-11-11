import { CustomersState } from "./types.ts";

const initialState : CustomersState = {
    list: [],
    loading: false
}

export const customerReducer = (state = initialState, action: any): CustomersState => {
    switch (action.type) {
      case "GET_LIST_CUSTOMER":
        return {
          ...state,
          loading: true,
        };
      case "GET_LIST_CUSTOMER_SUCCESS":
        return {
          ...state,
          loading: false,
          list: action.payload,
        };
      case "CLEAR_TABLE":
        return{
          list: [],
          loading: false
        }
    }
    return state
  };