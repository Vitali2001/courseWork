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


export interface CurrentOrderState{
    currentOrder: IOrderCurrent,
    selected: boolean
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
export interface ICustomerItem{
    image:string,
    lastName: string,
    firstName: string,
    middleName: string,
    email: string,
    phone: string,
    raiting: number
}