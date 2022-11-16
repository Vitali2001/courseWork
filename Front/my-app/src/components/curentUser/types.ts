export interface ICurrentUser{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    address: string,
    middleName: string,
    image: string,
    role: string
}

export interface CurrentUserState{
    currentUser: ICurrentUser,
    selected: boolean
} 
export interface IDeleteUser{
    email: string,
    reCaptchaToken: string
}