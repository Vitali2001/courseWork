import { OrdersUserState } from "./types.ts";

const initialState : OrdersUserState = {
    ordersUser: [],
    loading: false
}

export const ordersUserReducer = (state = initialState, action: any): OrdersUserState => {
    switch (action.type) {
      case "GET_LIST_ORDERS":
        return {
          ...state,
          loading: true,
        };
      case "GET_LIST_ORDERS_SUCCESS":
        return {
          ...state,
          loading: false,
          orders: action.payload,
        };
      case "CLEAR_TABLE_ORDERS":
        return{
          orders: [],
          loading: false
        }
    }
    return state
  };