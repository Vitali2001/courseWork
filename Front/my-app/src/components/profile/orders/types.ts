export interface IOrderItem{
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
}

export interface OrdersUserState{
    ordersUser: Array<IOrderItem>,
    loading: boolean
}

export interface  IPostOrderForDriver{
    email: string,
    recaptchaToken: string
}
export interface ICustomerItem{
    image:string,
    lastName: string,
    firstName: string,
    middleName: string,
    email: string,
    phone: string
}