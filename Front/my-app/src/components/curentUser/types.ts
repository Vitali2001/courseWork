export interface ICurrentUser{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    address: string,
    middleName: string,
    image: string,
    role: string,
    raiting: number
}

export interface CurrentUserState{
    currentUser: ICurrentUser,
    selected: boolean
} 
export interface IDeleteUser{
    email: string,
    reCaptchaToken: string
}
export default interface IOrderItem{
    id: number,
    name: string,
    fromRegion: string,
    fromCity: string,
    fromAddress: string,
    toRegion: string,
    toCity: string,
    toAddress: string,
    weight: string,
    image: string,
    price: number,
    emailCustomer: string
}
export interface IOrderItemForCustomer{
    id: number,
    name: string,
    fromRegion: string,
    fromCity: string,
    fromAddress: string,
    toRegion: string,
    toCity: string,
    toAddress: string,
    weight: string,
    image: string,
    price: number,
    date: Date,
    customerMark: number,
    driverMark: number 
    driverImage?: string,
    lastName?: string,
    firstName?: string,
    middleName?: string,
    email?: string,
    phone?: string,
    address?: string,
    role?: string
}
export interface  IPostOrderForDriver{
    email: string,
}
export interface IOrderCurrent{
    id: number,
    name: string,
    fromRegion: string,
    fromCity: string,
    fromAddress: string,
    toRegion: string,
    toCity: string,
    toAddress: string,
    weight: string,
    image: string,
    price: number,
    emailCustomer: string
}