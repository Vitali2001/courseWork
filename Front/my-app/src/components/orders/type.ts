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
export interface ICustomerItem{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    address: string,
    middleName: string,
    image: string
}
export interface OrdersSttate{
    orders: Array<IOrderItem>,
    loading: boolean
}
export interface IDriverIsOrder{
    id: number,
    emailDriver: string,
    recaptchaToken: string
}
export interface IDriverSetOrder{
    id: number,
    email: string,
    date: Date,
    recaptchaToken: string
}