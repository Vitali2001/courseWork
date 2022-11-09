import * as React from "react";
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";


const OrdersView: React.FC = () =>{
   
    return(
        <>
        <HomeLayout/>
        <UserNavbar/>
        <h1>Замовлення</h1>
        </>
    )
}

export default OrdersView
