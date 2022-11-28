export interface ICustomerItem{
    email: string,
    phone: string,
    lastName: string,
    firstName: string,
    address: string,
    middleName: string,
    image: string,
    raiting: number
}

export interface CustomersState{
    customers: Array<ICustomerItem>,
    loading: boolean
}