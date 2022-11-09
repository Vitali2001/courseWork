import axios from 'axios';
import { Dispatch } from "redux"
import http_common from '../../../http.common.js';
import {
    ILogin, ILoginResponse, IUser, LoginAuthAction,
    AuthActionTypes, LoginAuthSuccessAction
} from './types.ts';
import jwt_decode from 'jwt-decode';


export const LoginUser =
    (data: ILogin) => async (dispatch: Dispatch<LoginAuthAction>) => {
        try {
            //Відправили запит на логін
            dispatch({
                type: AuthActionTypes.LOGIN_AUTH
            });

            const response = await http_common.post<ILoginResponse>("api/account/login", data);
            const { token } = await response.data;
            //Залогінили користвача
            setAuthUserByToken(token, dispatch);
            
            return Promise.resolve();
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                console.log(err);
                dispatch({
                    type: AuthActionTypes.LOGIN_BREAK
                })
            }

            return Promise.reject();
        }
    }
const setAuthToken = (token: string) => {
    if (token) {
        http_common.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete http_common.defaults.headers.common["Authorization"];
    }
}

export const setAuthUserByToken = (
    token: string,
    dispatch: Dispatch<LoginAuthSuccessAction>
) => {
    setAuthToken(token);
    localStorage.token = token;
    const dataUser = jwt_decode<IUser>(token);
    dispatch({
        type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
        payload: dataUser,
    });
};