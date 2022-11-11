export interface IDriverItem{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    address: string,
    middleName: string,
    image: string
}

export interface DriversState{
    list: Array<IDriverItem>,
    loading: boolean
}