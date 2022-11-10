import { DriversState } from "./types.ts";

const initialState : DriversState = {
    list: [],
    loading: false
}

export const driverReducer = (state = initialState, action: any): DriversState => {
    switch (action.type) {
      case "GET_LIST_DRIVER":
        return {
          ...state,
          loading: true,
        };
      case "GET_LIST_DRIVER_SUCCESS":
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