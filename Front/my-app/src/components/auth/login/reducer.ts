
import { AuthState,AuthAction,AuthActionTypes } from "./types.ts";

const intialState: AuthState = {
    user: undefined,
    isAuth: false,
    loading:false

}

export const authReducer = (state = intialState, action: AuthAction): AuthState=>
{
    switch(action.type)
    {
        case AuthActionTypes.LOGIN_AUTH:
            return{
                ...state,
                isAuth: false,
                loading:true
            };
        case AuthActionTypes.LOGIN_AUTH_SUCCESS:
            return{
                ...state,
                isAuth: true,
                loading:false,
                user: { ...action.payload }
            };
        case AuthActionTypes.LOGIN_OUT:
            return{
                ...state,
                isAuth: false,
                user: undefined
            };
        case AuthActionTypes.LOGIN_BREAK:
            return{
                ...state,
                user: undefined,
                isAuth: false,
                loading:false
            }
        case AuthActionTypes.USER_UPDATE_SUCCESS:
            return{
                ...state,
                isAuth: true,
                loading:false,
                user: { ...action.payload }
            }
    }
    return state;
}