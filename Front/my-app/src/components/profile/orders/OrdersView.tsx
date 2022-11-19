import * as React from "react";
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import toastr from 'toastr';
import "toastr/build/toastr.css"
import axios from "axios"
import http from "../../../http.common";
import EclipseWidgetContainer from "../../Eclipse/index.tsx"
import { useDispatch } from "react-redux";
import { IOrderItem,IPostOrderForDriver,ICustomerItem} from "./types.ts";
import { useNavigate } from 'react-router-dom';



const OrdersView: React.FC = () =>{
   
    const {executeRecaptcha } = useGoogleReCaptcha();
    const navigator = useNavigate()
    const url = http.defaults.baseURL
    const {isAuth,user} = useTypedSelector(store=>store.auth)
    const {ordersUser, loading} = useTypedSelector(store=>store.ordersUser); 
    const [date, setDate] = React.useState("")
    const [time, setTime] = React.useState("")
    const [customer,setCustomer] = React.useState<ICustomerItem>(
        {
            image:"",
            lastName: "",
            firstName: "",
            middleName: "",
            email: "",
            phone: ""
        }
    );
    const [order,setOrder] = React.useState<IOrderItem>(
        {
            id: 0,
            name: "",
            fromRegion: "",
            fromCity: "",
            fromAddress:"",
            toRegion: "",
            toCity: "",
            toAddress: "",
            weight: "",
            image: "",
            price: "",
            date: new Date(),
            customerMark: 0,
            driverMark: 0 
        }
    )
    const dispatch = useDispatch();
    React.useEffect(() => {
          dispatch({
            type: "CLEAR_TABLE_ORDERS"
          })
          dispatch({
              type: "GET_LIST_ORDERS",
            });
        GetOrders()
            
          
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[dispatch]);
    let orderItem: IOrderItem = null
    let customerItem: ICustomerItem = null;
    function OnCustomerClick(item: any)
    {
        dispatch({
            type: "SET_CURRENT_USER",
            payload: item
          })
          navigator("/current_user")
    }
    async function GetOrders()
    {
        if(!executeRecaptcha)
            return
            const reCaptchaToken = await executeRecaptcha()
            const values: IPostOrderForDriver = {
                email: user.email,
                recaptchaToken: reCaptchaToken
            }
            const resp = await http.post("api/orders/getOrderDriver",values)
            const result = resp.data;
            dispatch({
                type: "GET_LIST_ORDERS_SUCCESS",
                payload: result,
            });
            orderItem = resp.data
            const res = await http.post("api/orders/getCustomer",orderItem.id)
            customerItem = res.data
            let d = new Date(orderItem.date);
            let t = new Date(orderItem.date)
            let m = d.getMonth();
            m++;
            setDate(`${d.getDate()}.${m}.${d.getFullYear()}`)
            setTime(`${t.getHours()}:${t.getMinutes()}`)
            setCustomer(customerItem);
            setOrder(orderItem);
    }
    return(
        <>
        <HomeLayout/>
        <UserNavbar/>
        <h1 style={{textAlign:"center"}}>Замовлення</h1>
        {
            loading?<EclipseWidgetContainer/>:<></>
        }
        { user.role === "driver"?
        (
            <div style={{textAlign:"center"}}>
                <h2>{order.name}</h2>
                    <img src={url+"api/account/files/1200_"+order.image} alt="" />
                    
                    <div style={{textAlign:"center"}}>
                    <h1>Точка завантаження:</h1>
                    <label>Область</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={order.fromRegion}/>
                    <br/>
                    <br/>
                    <label>Місто/населений пункт</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} style={{width:"300px"}} value={order.fromCity}/>
                    <br/>
                    <br/>
                    <label>Точна адреса</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} style={{width:"300px"}} value={order.fromAddress}/>
                    <h1>Точка прибуття:</h1>
                    <label>Область</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} style={{width:"300px"}} value={order.toRegion}/>
                    <br/>
                    <br/>
                    <label>Місто/населений пункт</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} style={{width:"300px"}} value={order.toCity}/>
                    <br/>
                    <br/>
                    <label>Точна адреса</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} style={{width:"300px"}} value={order.toAddress}/>
                    
                    </div>
                    <br/>
                    <h3>Ціна: {order.price} грн.</h3>
                    <h3>Дата завантаження: {date}</h3>
                    <h3>Час завантаження: {time}</h3>
                    <hr/>
                    <div>
                        <img src={url+"api/account/files/600_"+customer?.image} style={{borderRadius:"100px", margin:"-5px"}}
                 width="100px" alt="" onClick={(e)=>{OnCustomerClick(customer)}}/>
                        <h2>{customer.lastName}</h2>
                        <h2>{customer.firstName}</h2>
                        <h2>{customer.middleName}</h2>
                    </div>

                    
            </div>
        )
        : <></>}
        
        </>

    )
}

export default OrdersView
