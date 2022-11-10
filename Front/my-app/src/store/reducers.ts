import { combineReducers } from "redux";
import { authReducer } from "../components/auth/login/reducer.ts";
import {driverReducer} from "../components/drivers/reducer.ts"

export const rootReducer = combineReducers({
    auth: authReducer,
    drivers: driverReducer
});

export type RootState = ReturnType<typeof rootReducer>;