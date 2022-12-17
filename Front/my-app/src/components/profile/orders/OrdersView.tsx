import * as React from "react";
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import toastr from 'toastr';
import "toastr/build/toastr.css"
import http from "../../../http.common";
import EclipseWidgetContainer from "../../Eclipse/index.tsx"
import "./style.css"
import { useDispatch } from "react-redux";
import { IPostOrderForDriver,IOrderItemForCustomer,IDriverSetMark,ICustomerSetMark,IOrderItemForDriver} from "./types.ts";
import { useNavigate } from 'react-router-dom';
import classNames from "classnames";



const OrdersView: React.FC = () =>{
   
   
    const {executeRecaptcha } = useGoogleReCaptcha();
    const navigator = useNavigate()
    const url = http.defaults.baseURL
    const {isAuth,user} = useTypedSelector(store=>store.auth)
    const {loading} = useTypedSelector(store=>store.ordersUser); 
    const [showDelete,setShowDelete] = React.useState<boolean>(false)
    const [showMarks,setShowMarks] = React.useState<boolean>(false);
    const [id, setId] = React.useState(0)
    const [mark,setMark] = React.useState(0)
  
    const [ordersCustomer,setOrdersCustomer] = React.useState<IOrderItemForCustomer>([])
    const [ordersDriver,setOrdersDriver] = React.useState<IOrderItemForDriver>([])
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
    function OnCustomerClick(item: any)
    {
        let pay: any = {
            lastName: item.lastName,
            firstName: item.firstName,
            middleName: item.middleName,
            email: item.email,
            phone: item.phone,
            role: "customer",
            image: item.userImage,
            address: item.address
        }
        dispatch({
            type: "SET_CURRENT_USER",
            payload: pay
          })
          navigator("/current_user")
    }
    function AddOrder()
    {
        navigator("/add_order")
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
            toastr.success("Ви видалили замовлення!","Успіх!")
            setShowDelete(false)
            GetOrdersCustomer();
        }
        catch(ex)
        {
            console.log(ex)
            toastr.error("Помилка сервера!","Помилка!")
            setShowDelete(false)
        }
    }
    function CallSetMark(item:number)
    {
        setId(item)
        setShowMarks(true);
    }
    function CallModal(item:number){
        
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
            image: item.driverImage,
            address: item.address
        }
        dispatch({
            type: "SET_CURRENT_USER",
            payload: pay
          })
          navigator("/current_user")
    }
    let OrdersDriver: IOrderItemForDriver = [];
    async function GetOrders()
    {
        const values: IPostOrderForDriver = {
            email: user.email,
        }
        const resp = await http.post("api/orders/getOrderDriver",values)
        OrdersDriver = resp.data;
        setOrdersDriver(OrdersDriver)
        const result = await http.post("api/orders/getOrdersForDrivers",values)
        dispatch({
            type: "GET_LIST_ORDERS_SUCCESS",
            payload: result.data,
        });
        console.log(resp.data)
    }
    let OrdersCustomer: IOrderItemForCustomer = [];
    async function GetOrdersCustomer()
    {
            const values: IPostOrderForDriver = {
                email: user.email,
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
    async function OnSetMark()
    {
       if(user.role==="driver")
        {
            if(!executeRecaptcha)
            return
            if(mark === 0)
             setMark(5)
            const reCaptchaToken = await executeRecaptcha()
            const values: IDriverSetMark = {
            mark: mark,
            recaptchaToken: reCaptchaToken,
            email: user.email,
            id: id
        }
        try{
            const resp = await http.post("api/orders/setMarkDriver",values)
            if(resp.data === "ok")
            toastr.success("Ви Поставили оцінку замовнику!","Замовлення завершене!")
            setShowMarks(false)
            GetOrders();
        }
        catch(ex)
        {
            console.log(ex)
            toastr.error("Помилка сервера!","Помилка!")
            setShowMarks(false)
        }
        }
        if(user.role === "customer")
        {
            if(!executeRecaptcha)
            return
            if(mark === 0)
             setMark(5)
            const reCaptchaToken = await executeRecaptcha()
            const values: ICustomerSetMark = {
            mark: mark,
            recaptchaToken: reCaptchaToken,
            email: user.email,
            id: id
        }
        try{
            const resp = await http.post("api/orders/setMarkCustomer",values)
            console.log(resp)
            if(resp.data === "ok")
            toastr.success("Ви Поставили оцінку водію!","Замовлення завершене!")
            setShowMarks(false)
            GetOrdersCustomer();
        }
        catch(ex)
        {
            console.log("ex")
            console.log(ex)
            toastr.error("Помилка сервера!","Помилка!")
            setShowMarks(false)
        }
        }
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
    function CareerModalMarks({showMarks, setShowMarks,id}) {  
        const [ch1,setCh1] = React.useState<boolean>(false);
        const [ch2,setCh2] = React.useState<boolean>(false);
        const [ch3,setCh3] = React.useState<boolean>(false);
        const [ch4,setCh4] = React.useState<boolean>(false);
        const [ch5,setCh5] = React.useState<boolean>(false);
        function SetStar(id: number)
    {
        if(id===1)
        {
            setCh1(true)
            setCh2(false)
            setCh3(false) 
            setCh4(false) 
            setCh5(false) 
        }
        if(id===2)
        {
            setCh1(false)
            setCh2(true)
            setCh3(false) 
            setCh4(false) 
            setCh5(false) 
        }
        if(id===3)
        {
            setCh1(false)
            setCh2(false)
            setCh3(true) 
            setCh4(false) 
            setCh5(false) 
        }
        if(id===4)
        {
            setCh1(false)
            setCh2(false)
            setCh3(false) 
            setCh4(true) 
            setCh5(false) 
        }  
        if(id===5)
        {
            setCh1(false)
            setCh2(false)
            setCh3(false) 
            setCh4(false) 
            setCh5(true) 
        }
        setMark(id)
    }
        return (
           
            <>
              <div className={classNames("modal",{"custom-modal": showMarks})}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                       {
                      user.role === "driver"?
                      <h5 className="modal-title">Поставте оцінку замовнику</h5> 
                      :
                      <h5 className="modal-title">Поставте оцінку водію</h5> 
                      }
                     
                     <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={()=>{setShowMarks(false)}}
                        
                      ></button>
                     
                    </div>
                    <div className="modal-body" style={{textAlign:"center"}}>
                    <div className="star-rating">
            <div className="star-rating__wrap" style={{textAlign:"center"}}>
                <input className="star-rating__input" checked={ch5} type="radio" name="rating" value="5"/>
                <label className="star-rating__ico fa fa-star-o fa-lg" id="5" onClick={()=>{SetStar(5)}} title="5 out of 5 stars"/>
                <input className="star-rating__input" checked={ch4} type="radio" name="rating" value="4"/>
                <label className="star-rating__ico fa fa-star-o fa-lg" id="4" onClick={()=>{SetStar(4)}} title="4 out of 5 stars"/>
                <input className="star-rating__input" checked={ch3} type="radio" name="rating" value="3"/>
                <label className="star-rating__ico fa fa-star-o fa-lg" id="3" onClick={()=>{SetStar(3)}} title="3 out of 5 stars"/>
                <input className="star-rating__input" checked={ch2} type="radio" name="rating" value="2"/>
                <label className="star-rating__ico fa fa-star-o fa-lg" id="2" onClick={()=>{SetStar(2)}} title="2 out of 5 stars"/>
                <input className="star-rating__input" checked={ch1} type="radio" name="rating" value="1"/>
                <label className="star-rating__ico fa fa-star-o fa-lg" id="1" onClick={()=>{SetStar(1)}} title="1 out of 5 stars"/>
            </div>          
        </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={()=>{setShowMarks(false)}}
                      >
                        Скасувати
                      </button>
                      {
                         loading?
                         <EclipseWidgetContainer/>
                         :
                      <button type="button" className="btn btn-success" onClick={OnSetMark}>
                        Завершити
                      </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
      }
    const viewOrdersEndDriver = ordersDriver.map((item: IOrderItemForDriver) => (
        <div > 
             {
                item.email !== "" && item.customerMark !== 0
                ?
                (
                    <div>
                    <h3>Завершене &#128994;</h3>
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
                        <p>
                            <button className="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                Замовник
                            </button>
                            </p>
                            <div className="collapse" id="collapseExample">
                            <div className="card card-body">
                            <img src={url+"api/account/files/600_"+item?.userImage} style={{borderRadius:"100px",marginLeft:"60px"}}
                 width="100px" alt="" onClick={(e)=>{OnCustomerClick(item)}}/>
                        <p className="card-text">{item.lastName}</p>
                        <p className="card-text">{item.firstName}</p>
                        <p className="card-text">{item.middleName}</p>
                            </div>
                            </div>
                        <hr/>
                        <button className="btn btn-success" onClick={()=>{CallSetMark(item.id)}}>Завершити</button>
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
    const viewOrdersDriver = ordersDriver.map((item: IOrderItemForDriver) => (
        <div > 
             {
                item.email !== "" && item.customerMark === 0
                ?
                (
                    <div style={{textAlign:"center"}}>
                    <h3>Прийняте <small>&#128993;</small></h3>
                    <div className="card" key={item.id} style={{width: "18rem",margin:"10px",marginLeft:"550px"}}>
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
                        <p>
                            <button className="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                Замовник
                            </button>
                            </p>
                            <div className="collapse" id="collapseExample">
                            <div className="card card-body">
                            <img src={url+"api/account/files/600_"+item?.userImage} style={{borderRadius:"100px",marginLeft:"60px"}}
                 width="100px" alt="" onClick={(e)=>{OnCustomerClick(item)}}/>
                        <p className="card-text">{item.lastName}</p>
                        <p className="card-text">{item.firstName}</p>
                        <p className="card-text">{item.middleName}</p>
                        </div>
                        </div>
                        <hr/>
                        <button className="btn btn-success" onClick={()=>{CallSetMark(item.id)}}>Завершити</button>
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
    const viewOrdersEnd = ordersCustomer.map((item: IOrderItemForCustomer) => (
        <div > 
             {
                item.email !== "" && item.driverMark !== 0
                ?
                (
                    <div>
                    <h3>Завершене &#128994;</h3>
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
                        <p>
                            <button className="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                Водій
                            </button>
                            </p>
                            <div className="collapse" id="collapseExample">
                            <div className="card card-body">
                            <img src={url+"api/account/files/600_"+item?.driverImage} style={{borderRadius:"100px",marginLeft:"60px"}}
                 width="100px" alt="" onClick={(e)=>{OnDriverClick(item)}}/>
                        <p className="card-text">{item.lastName}</p>
                        <p className="card-text">{item.firstName}</p>
                        <p className="card-text">{item.middleName}</p>
                            </div>
                            </div>
                        <hr/>
                        <button className="btn btn-success" onClick={()=>{CallSetMark(item.id)}}>Завершити</button>
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
    const viewOrdersSuccess = ordersCustomer.map((item: IOrderItemForCustomer) => (
        <div > 
             {
                item.email !== "" && item.driverMark === 0
                ?
                (
                    <div>
                    <h3>Прийняте <small>&#128993;</small></h3>
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
                        <p>
                            <button className="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                Водій
                            </button>
                            </p>
                            <div className="collapse" id="collapseExample">
                            <div className="card card-body">
                            <img src={url+"api/account/files/600_"+item?.driverImage} style={{borderRadius:"100px",marginLeft:"60px"}}
                 width="100px" alt="" onClick={(e)=>{OnDriverClick(item)}}/>
                        <p className="card-text">{item.lastName}</p>
                        <p className="card-text">{item.firstName}</p>
                        <p className="card-text">{item.middleName}</p>
                            </div>
                            </div>
                        <hr/>
                        <button className="btn btn-success" onClick={()=>{CallSetMark(item.id)}}>Завершити</button>
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
                        <h3>В очікуванні &#128308;</h3>
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
        <div>
        <HomeLayout/>
        {
            isAuth?
            (
                <div>
            
        
        <UserNavbar/>
                <h1 style={{textAlign:"center"}}>Мої замовлення</h1>
                {
                    loading?<EclipseWidgetContainer/>:<></>
                }
                { user.role === "driver"?
        (
            <div>
                    <CareerModal
                    id = {id}
                    showDelete = {showDelete}
                    setShowDelete = {setShowDelete}
                    />
                    <CareerModalMarks
                        showMarks={showMarks}
                        id = {id}
                        setShowMarks = {setShowMarks}
                    />
            {
                ordersDriver.length < 1 ?
                
                    <div style={{textAlign:"center"}}><h1>Ви не маєте замовлень</h1></div>
                    :
                    (
                       <div>  <div>
                       <hr/>{
                    viewOrdersDriver
                   }
                   
                   </div>
                
                   <div style={{textAlign:"center",display:"flex",flexDirection:"row"}}><hr/>{viewOrdersEndDriver}</div></div>
                    )
                
            }
        </div>
        )
        : 
        <div>
                    <CareerModal
                    id = {id}
                    showDelete = {showDelete}
                    setShowDelete = {setShowDelete}
                    />
                    <CareerModalMarks
                        showMarks={showMarks}
                        id = {id}
                        setShowMarks = {setShowMarks}
                    />
                    <button type="button" className="btn btn-success" style={{margin:"20px",marginLeft:"630px"}}
                     onClick={AddOrder}>
                        Додати замовлення
                      </button>
            <div style={{textAlign:"center",display:"flex",flexDirection:"row",marginLeft:"10px"}}>
                <hr/>{
             viewOrders
            }
            </div>
            <div style={{textAlign:"center",display:"flex",flexDirection:"row"}}><hr/>{viewOrdersSuccess}</div>
            <div style={{textAlign:"center",display:"flex",flexDirection:"row"}}><hr/>{viewOrdersEnd}</div>
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
