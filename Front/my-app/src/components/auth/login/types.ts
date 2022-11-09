export enum AuthActionTypes {
    LOGIN_AUTH = "LOGIN_AUTH",
    LOGIN_AUTH_SUCCESS = "LOGIN_AUTH_SUCCESS",
    LOGIN_OUT = "LOGIN_OUT",
    LOGIN_BREAK = "LOGIN_BREAK",
    USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS"
};

export interface ILogin {
    email: string,
    password: string,
    recaptchaToken?: string
}

export interface AuthState{
    user?: IUser|undefined,
    isAuth: boolean,
    loading:boolean
}

export interface ILoginResponse {
    token: string
}

export interface IUser {
    id: string,
    email: string,
    lastName: string,
    firstName: string,
    middleName: string,
    image: string,
    address: string,
    phone: string,
    role: string,
    exp: Date | null
}


export interface LoginAuthAction {
    type: AuthActionTypes.LOGIN_AUTH
}

export interface LoginAuthSuccessAction {
    type: AuthActionTypes.LOGIN_AUTH_SUCCESS,
    payload: IUser
}
export interface LoginOut{
    type: AuthActionTypes.LOGIN_OUT
}
export type AuthAction = LoginAuthAction | LoginAuthSuccessAction | LoginOut;