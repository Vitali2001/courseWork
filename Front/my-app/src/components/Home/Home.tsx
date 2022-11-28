import React, { useEffect } from 'react'
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import { useDispatch } from "react-redux";
import axios from "axios"
import http from "../../http.common"
import EclipseWidgetContainer from "../../components/Eclipse/index.tsx"
import { useNavigate } from 'react-router-dom';
import { IDriverItem,ICustomerItem,IOrderItem} from './types.ts';

const HomePageLayout: React.FC = () => {
    
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const url = http.defaults.baseURL
    const {drivers, loading} = useTypedSelector(store=>store.drivers); 
    const {customers,Loading} = useTypedSelector(store=>store.customers); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {orders, loading1} = useTypedSelector(store=>store.orders); 

    useEffect(() => {
        dispatch({
            type: "CLEAR_CURRENT_ORDER"
          })
        dispatch({
          type: "CLEAR_CURRENT_USER"
        })
          dispatch({
            type: "CLEAR_TABLE"
          })
          dispatch({
              type: "GET_LIST_DRIVER",
            });
            
            axios.get<Array<IDriverItem>>("http://localhost:8080/api/users/drivers").then((resp) => {
              dispatch({
                type: "GET_LIST_DRIVER_SUCCESS",
                payload: resp.data,
              });
             
            });
            axios.get<Array<ICustomerItem>>("http://localhost:8080/api/users/customers").then((resp) => {
                dispatch({
                  type: "GET_LIST_CUSTOMER_SUCCESS",
                  payload: resp.data,
                });
                
               
              });
              dispatch({
                type: "GET_LIST_ORDER",
              });
              axios.get<Array<IOrderItem>>("http://localhost:8080/api/orders/NotAcceptedOrders").then((resp) => {
                dispatch({
                  type: "GET_LIST_ORDER_SUCCESS",
                  payload: resp.data,
                });
               
              });
              
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[dispatch]);
    
    function OnClickDriver(item : any){
            dispatch({
              type: "SET_CURRENT_USER",
              payload: item
            })
            navigator("/current_user")
          }
    function OnClickCustomer(item : any){
            dispatch({
              type: "SET_CURRENT_USER",
              payload: item
            })
            navigator("/current_user")
          }
    function byFieldDown(field) {
            return (a, b) => a[field] < b[field] ? 1 : -1;
    }
    function OnClickOrder(item: any)
      {
        dispatch({
          type: "SET_CURRENT_ORDER",
          payload: item
        })
        navigator("/current_order")
      }
    let s: IDriverItem = []
    let topFiveDrivers: IDriverItem = [];
    let ch: ICustomerItem = []
    let topFiveCustomers: ICustomerItem = [];
    function SortArray()
    {
        let arr = drivers;
        arr.sort(byFieldDown("raiting"))
        s = arr
        topFiveDrivers = s
        topFiveDrivers = topFiveDrivers.slice(0,5)
        topFiveCustomers = customers
        console.log(Loading)
        let arr1 = customers;
        arr1.sort(byFieldDown("raiting"))
        ch = arr1
        topFiveCustomers = ch
        topFiveCustomers = topFiveCustomers.slice(0,5)
    }
    SortArray();
    const viewDrivers = topFiveDrivers.map((item) => (
        <div className="card" style={{width: "260px",margin:"10px"}}
        onClick={()=>{OnClickDriver(item)}}>
        <img src={url+"api/account/files/1200_"+item.image} style={{width:"258px"}} className="card-img-top" alt="..."/>
        <div className="card-body">
            <h3 className="card-text">{item.lastName}</h3>
            <h3 className="card-text">{item.firstName}</h3>
            <h3 className="card-text">{item.middleName}</h3>
        </div>
        </div> ));
    const viewCustomers = topFiveCustomers.map((item) => (
        <div className="card" style={{width: "260px",margin:"10px"}}
        onClick={()=>{OnClickCustomer(item)}}>
        <img src={url+"api/account/files/1200_"+item.image} style={{width:"258px"}} className="card-img-top" alt="..."/>
        <div className="card-body">
            <h3 className="card-text">{item.lastName}</h3>
            <h3 className="card-text">{item.firstName}</h3>
            <h3 className="card-text">{item.middleName}</h3>
        </div>
        </div> ));
   const viewOrders = orders.map((item)=>(
    <div className="card text-bg-primary mb-3" style={{margin:"10px" , width:"300px"}} onClick={()=>{OnClickOrder(item)}}>
  <div className="card-header"><h1>{item.name}</h1></div>
  <div className="card-body">
    <h5 className="card-title">{item.price} грн</h5>
    <hr/>
    <p className="card-text">Звідки: {item.fromRegion}</p>
    <hr/>
    <p className="card-text">Куди: {item.toRegion}</p>
    <hr/>
    <p className="card-text">Об`єм/маса: {item.weight}</p>
  </div>
</div>
   ));
    return(
        <div>
            {
                loading?
                <EclipseWidgetContainer/>
                :
                (
                   <div>
                     <div>
                        <h1 style={{textAlign:"center"}}>Наші найкращі водії</h1>
                        <div style={{textAlign:"center",display:"flex",flexDirection:"row" ,
                            flexWrap:"wrap"}}>{viewDrivers}</div>
                    </div>
                    <div>
                        <h1 style={{textAlign:"center"}}>Наші найкращі замовники</h1>
                        <div style={{textAlign:"center",display:"flex",flexDirection:"row" ,
                            flexWrap:"wrap"}}>{viewCustomers}</div>
                    </div>
                    <div>
                        <h1 style={{textAlign:"center"}}>Вільні замовлення</h1>
                        <div style={{textAlign:"center",display:"flex",flexDirection:"row" ,
                        flexWrap:"wrap",marginLeft:"60px"}}>{viewOrders}</div>
                    </div>
                    </div>
                )
            }
        </div>
    )
}


export default HomePageLayout