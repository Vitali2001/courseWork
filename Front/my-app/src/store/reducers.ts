import { combineReducers } from "redux";
import { authReducer } from "../components/auth/login/reducer.ts";
import {driverReducer} from "../components/drivers/reducer.ts"
import {currentUserReducer} from "../components/curentUser/reducer.ts"
import {customerReducer} from "../components/customers/reducer.ts"

export const rootReducer = combineReducers({
    auth: authReducer,
    drivers: driverReducer,
    currentUser: currentUserReducer,
    customers: customerReducer
});

export type RootState = ReturnType<typeof rootReducer>;