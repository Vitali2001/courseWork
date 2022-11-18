import { OrdersState } from "./types.ts";

const initialState : OrdersState = {
    orders: [],
    loading: false
}

export const orderReducer = (state = initialState, action: any): OrdersState => {
    switch (action.type) {
      case "GET_LIST_ORDER":
        return {
          ...state,
          loading: true,
        };
      case "GET_LIST_ORDER_SUCCESS":
        return {
          ...state,
          loading: false,
          orders: action.payload,
        };
      case "CLEAR_TABLE":
        return{
          orders: [],
          loading: false
        }
    }
    return state
  };