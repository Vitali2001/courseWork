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
}
export interface ICustomerItem{
    image:string,
    lastName: string,
    firstName: string,
    middleName: string,
    email: string,
    phone: string
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

export interface IDriverSetMark{
    id: number,
    mark:number,
    email: string,
    recaptchaToken: string
}
export interface ICustomerSetMark{
    id: number,
    mark:number,
    email: string,
    recaptchaToken: string
}
export interface IOrderItemForDriver{
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
    userImage?: string,
    lastName?: string,
    firstName?: string,
    middleName?: string,
    email?: string,
    phone?: string,
    address?: string,
    role?: string
}