export interface IDriverItem{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    middleName: string,
    image: string
}

export interface DriversState{
    list: Array<IDriverItem>,
    loading: boolean
}