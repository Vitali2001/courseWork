import * as React from "react";
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import toastr from 'toastr';
import "toastr/build/toastr.css"
import http from "../../../http.common";
import EclipseWidgetContainer from "../../Eclipse/index.tsx"
import { useDispatch } from "react-redux";
import { IOrderItem,IPostOrderForDriver,ICustomerItem,IOrderItemForCustomer} from "./types.ts";
import { useNavigate } from 'react-router-dom';
import classNames from "classnames";



const OrdersView: React.FC = () =>{
   
   
    const {executeRecaptcha } = useGoogleReCaptcha();
    const navigator = useNavigate()
    const url = http.defaults.baseURL
    const {isAuth,user} = useTypedSelector(store=>store.auth)
    const {loading} = useTypedSelector(store=>store.ordersUser); 
    const [date, setDate] = React.useState("")
    const [time, setTime] = React.useState("")
    const [showDelete,setShowDelete] = React.useState<boolean>(false)
    const [id, setId] = React.useState(0)
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
  
    const [ordersCustomer,setOrdersCustomer] = React.useState<IOrderItemForCustomer>([])
    const dispatch = useDispatch();
    React.useEffect(() => {
        
        dispatch({
            type: "CLEAR_TABLE_ORDERS"
          })
          dispatch({
              type: "GET_LIST_ORDERS",
            });
        if(user.role === "driver")
         GetOrders()
        if(user.role === "customer")
            GetOrdersCustomer()

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
    async function DeleteOrder(item: number)
    {
        if(!executeRecaptcha)
            return
            const reCaptchaToken = await executeRecaptcha()
        const values: any = {
            id: item,
            recaptchaToken: reCaptchaToken
        }
        try{
            const resp = await http.post("api/orders/deleteOrder",values)
            if(resp.data === "ok")
            toastr.success("Ви видалили замовлення!Додайте нове!","Успіх!")
            setShowDelete(false)
            navigator("/orders")
        }
        catch(ex)
        {
            console.log(ex)
            toastr.error("Помилка сервера!","Помилка!")
            setShowDelete(false)
        }
    }
    function CallModal(item:number){
        
        console.log("ok")
        setId(item)
        setShowDelete(true)

    }
    function OnDriverClick(item: any)
    {
        let pay: any = {
            lastName: item.lastName,
            firstName: item.firstName,
            middleName: item.middleName,
            email: item.email,
            phone: item.phone,
            role: "driver",
            image: item.driverImage
        }
        dispatch({
            type: "SET_CURRENT_USER",
            payload: pay
          })
          navigator("/current_user")
    }
    async function GetOrders()
    {
       if(executeRecaptcha === undefined)
       navigator("/profile")
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
    let OrdersCustomer: IOrderItemForCustomer = [];
    async function GetOrdersCustomer()
    {
        if(executeRecaptcha === undefined)
       navigator("/profile")
        if(!executeRecaptcha)
            return
            const reCaptchaToken = await executeRecaptcha()
            const values: IPostOrderForDriver = {
                email: user.email,
                recaptchaToken: reCaptchaToken
            }
            const resp = await http.post("api/orders/getOrderCustomer",values)
            OrdersCustomer = resp.data;
            setOrdersCustomer(OrdersCustomer)
            const result = await http.post("api/orders/getOrdersForCustomers",values)
            dispatch({
                type: "GET_LIST_ORDERS_SUCCESS",
                payload: result.data,
            });
            
    }
    function GetDate(date: any)
    {
        var item = new Date(date.date);
        let d = item.getDate();
        let m = item.getMonth();
        m++;
        let y = item.getFullYear();
        return (<div>{`${d}.${m}.${y}`}</div>)
    }
    function GetTime(date: any)
    {
        var item = new Date(date.date);
        let t = item.getHours();
        let m = item.getMinutes();
        return(<div>{`${t}:${m}`}</div>)
    }
    function CareerModal({showDelete, setShowDelete,id}) {  
        
        return (
           
            <>
              <div className={classNames("modal",{"custom-modal": showDelete})}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Введіть дату та час завантаження</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={()=>{setShowDelete(false)}}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h1>Ви впевнені що хочете видалити це замовлення?</h1>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={()=>{setShowDelete(false)}}
                      >
                        Скасувати
                      </button>
                      {
                         loading?
                         <EclipseWidgetContainer/>
                         :
                      <button type="button" className="btn btn-danger" onClick={()=>{DeleteOrder(id)}}>
                        Видалити
                      </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
      }
    const viewOrdersSuccess = ordersCustomer.map((item: IOrderItemForCustomer) => (
        <div > 
             {
                item.email !== ""
                ?
                (
                    <div>
                    <h3>Прийняті &#128994;</h3>
                    <div className="card" key={item.id} style={{width: "18rem",margin:"10px"}}>
                    <img src={url+"api/account/files/600_"+item.image} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h1 className="card-title" >{item.name}</h1>
                        <hr/>
                        <h3 className="card-text">Звідки</h3>
                        <p className="card-text">{item.fromRegion}</p>
                        <p className="card-text">{item.fromCity}</p>
                        <p className="card-text">{item.fromAddress}</p>
                        <h3 className="card-text">Куди</h3>
                        <p className="card-text">{item.toRegion}</p>
                        <p className="card-text">{item.toCity}</p>
                        <p className="card-text">{item.toAddress}</p>
                        <h3 className="card-text">{item.price} грн</h3>
                        <h3>Дата завантаження: <GetDate date={item.date}/></h3>
                        <h3>Час завантаження: <GetTime date={item.date}/></h3>
                        
                        <hr/>
                        <h3>Водій</h3>
                        <img src={url+"api/account/files/600_"+item?.driverImage} style={{borderRadius:"100px", margin:"-5px"}}
                 width="100px" alt="" onClick={(e)=>{OnDriverClick(item)}}/>
                        <p className="card-text">{item.lastName}</p>
                        <p className="card-text">{item.firstName}</p>
                        <p className="card-text">{item.middleName}</p>
                        <hr/>
                        <button className="btn btn-danger">Видалити</button>
                    </div>
                    </div>
                  </div>
                )
                :
                (
                  <></>
                )
             }
        </div>));
    const viewOrders = ordersCustomer.map((item: IOrderItemForCustomer) => (
        <div > 
             {
                item.email === ""
                ?
                (
                    <div>
                        <h3>В очікуванні &#128993;</h3>
                    <div className="card" key={item.id} style={{width: "18rem",margin:"10px"}}>
                    <img src={url+"api/account/files/600_"+item.image} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h1 className="card-title" >{item.name}</h1>
                        <hr/>
                        <h3 className="card-text">Звідки</h3>
                        <p className="card-text">{item.fromRegion}</p>
                        <p className="card-text">{item.fromCity}</p>
                        <p className="card-text">{item.fromAddress}</p>
                        <h3 className="card-text">Куди</h3>
                        <p className="card-text">{item.toRegion}</p>
                        <p className="card-text">{item.toCity}</p>
                        <p className="card-text">{item.toAddress}</p>
                        <h3 className="card-text">{item.price} грн</h3>
                        <hr/>
                        <button className="btn btn-danger" onClick={()=>{CallModal(item.id)}}>Видалити</button>
                    </div>
                </div>
                    </div>
                )
                :
                (
                    <></>
                )
             }
        </div>));
    return(
        <div style={{display:"flex",flexDirection:"column"}}>
        <HomeLayout/>
        {
            isAuth?
            (
                <div>
            
        
        <UserNavbar/>
                <h1 style={{textAlign:"center"}}>Замовлення</h1>
                {
                    loading?<EclipseWidgetContainer/>:<></>
                }
                { user.role === "driver"?
                    (
            <div style={{textAlign:"center"}}>
                <div className="card" style={{width: "18rem",marginLeft:"560px"}}>
                    <img src={url+"api/account/files/600_"+order.image} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h1 className="card-title">{order.name}</h1>
                        <hr/>
                        <h3 className="card-text">Звідки</h3>
                        <p className="card-text">{order.fromRegion}</p>
                        <p className="card-text">{order.fromCity}</p>
                        <p className="card-text">{order.fromAddress}</p>
                        <h3 className="card-text">Куди</h3>
                        <p className="card-text">{order.toRegion}</p>
                        <p className="card-text">{order.toCity}</p>
                        <p className="card-text">{order.toAddress}</p>
                        <h3 className="card-text">{order.price} грн</h3>
                        <h3 className="card-text">Дата завантаження: {date}</h3>
                        <h3 className="card-text">Час завантаження: {time}</h3>
                        <hr/>
                        <h3 className="card-text">Замовник</h3>
                        <img src={url+"api/account/files/600_"+customer?.image} style={{borderRadius:"100px", margin:"-5px"}}
                 width="100px" alt="" onClick={(e)=>{OnCustomerClick(customer)}}/>
                        <p className="card-text">{customer.lastName}</p>
                        <p className="card-text">{customer.firstName}</p>
                        <p className="card-text">{customer.middleName}</p>
                        <hr/>
                        <button className="btn btn-success">Завершити</button>
                    </div>
                </div>
            </div>
        )
        : 
        <div>
                    <CareerModal
                    id = {id}
                    showDelete = {showDelete}
                    setShowDelete = {setShowDelete}
                    />
            <div style={{textAlign:"center",display:"flex",flexDirection:"row"}}>{
             viewOrders
            }
            </div>
            <div style={{textAlign:"center",display:"flex",flexDirection:"row"}}>{viewOrdersSuccess}</div>
        </div>
        }
        </div>
            )
            :
            <div style={{textAlign:"center"}}>Сталася помилка!</div>
        }
           
        
        
        </div>

    )
}

export default OrdersView
