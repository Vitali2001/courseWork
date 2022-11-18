import React, { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import {IOrderItem,ICustomerItem,IDriverIsOrder,IDriverSetOrder} from "./type.ts"
import axios from "axios"
import http from "../../http.common"
import EclipseWidgetContainer from "../../components/Eclipse/index.tsx"
import { useNavigate } from 'react-router-dom';
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import toastr from 'toastr';
import "toastr/build/toastr.css"
import classNames from "classnames";
import "./style.css";


const OrdersView: React.FC = () =>{
   
    const navigator = useNavigate()
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [search,setSearch] = useState('')
    const [warningSearch, setWarningSearch] = useState("");
    const {orders, loading} = useTypedSelector(store=>store.orders); 
    const [s,setS] = useState(Array<IOrderItem>)
    const dispatch = useDispatch();
    const [valueSort, setValuesort] = useState('default');
    const [showDate,setShowDate] = React.useState<boolean>(false)
    
    const url = http.defaults.baseURL
   
    const {isAuth,user} = useTypedSelector(store=>store.auth)
    const [order,setOrder] = useState<IOrderItem>();

    useEffect(() => {
      dispatch({
        type: "CLEAR_CURRENT_ORDER"
      })
        dispatch({
          type: "CLEAR_TABLE"
        })
        dispatch({
            type: "GET_LIST_ORDER",
          });
          axios.get<Array<IOrderItem>>("http://localhost:8080/api/orders/NotAcceptedOrders").then((resp) => {
            dispatch({
              type: "GET_LIST_ORDER_SUCCESS",
              payload: resp.data,
            });
           
          });
          dispatch({
            type: "GET_LIST_CUSTOMER",
          });
          axios.get<Array<ICustomerItem>>("http://localhost:8080/api/users/customers").then((resp) => {
            dispatch({
              type: "GET_LIST_CUSTOMER_SUCCESS",
              payload: resp.data,
            });
           
          });
        
      },[dispatch]);
      function OnAddClick()
      {
        navigator("/add_order")
      }
       function OnLoginClick()
       {
        navigator("/login")
       }
       function OnRegisterClick()
       {
          navigator("/register")
       }
       let arrs: IOrderItem = []
      
       function OnChangeSearch(event){
         setSearch(event.target.value);
         
         orders.forEach(function(item: IOrderItem){
           let name : string = item.name
           let fromRegion : string = item.fromRegion
           let toRegion : string = item.toRegion
           let weight : string = item.weight
           if(name.toLowerCase().includes(event.target.value.toLowerCase())
             || fromRegion.toLowerCase().includes(event.target.value.toLowerCase())
             || toRegion.toLowerCase().includes(event.target.value.toLowerCase())
             || weight.toLowerCase().includes(event.target.value.toLowerCase())){
             arrs.push(item)
           }
 
        })
        setS(arrs)
        
        if(event.target.value !== "" && arrs.length < 1){
         setWarningSearch("Нічого не знайдено")
        }
        else
        {
         setWarningSearch("")
        }
       }
       function byFieldUp(field) {
        return (a, b) => a[field] > b[field] ? 1 : -1;
      }
      function byFieldDown(field) {
        return (a, b) => a[field] < b[field] ? 1 : -1;
      }
      function OnChangeSort(event)
      {
        setValuesort(event.target.value)
        console.log(event.target.value)
        let arr = orders;
        if(event.target.value === "priceDown")
        {
          arr.sort(byFieldUp("price"))
          setS(arr)
        }
        if(event.target.value === "priceUp")
        {
          arr.sort(byFieldDown("price"))
          setS(arr)
        }
        if(event.target.value === "weightDown")
        {
          arr.sort(byFieldUp("weight"))
          setS(arr)
        }
        if(event.target.value === "weightUp")
        {
          arr.sort(byFieldDown("weight"))
          setS(arr)
        }
        if(event.target.value === "fromRegionDown")
        {
          arr.sort(byFieldUp("fromRegion"))
          setS(arr)
        }
        if(event.target.value === "fromRegionUp")
        {
          arr.sort(byFieldDown("fromRegion"))
          setS(arr)
        }
        if(event.target.value === "toRegionDown")
        {
          arr.sort(byFieldUp("toRegion"))
          setS(arr)
        }
        if(event.target.value === "toRegionUp")
        {
          arr.sort(byFieldDown("toRegion"))
          setS(arr)
        }
      }
      let f: IOrderItem = null;
      function OnClickOrder(item: any)
      {
        dispatch({
          type: "SET_CURRENT_ORDER",
          payload: item
        })
        navigator("/current_order")
      }
      async function OnAcceptClick(item: any)
      {
        setOrder(item)
        if(!executeRecaptcha )
            return
            const reCaptchaToken = await executeRecaptcha()
            const values: IDriverIsOrder = 
            {
                reCaptchaToken: reCaptchaToken,
                id: item.id,
                emailDriver: user.email
            };
            try{
              const result = await http.post("api/orders/verifyDriver",values);
              
              if(result.data === "no")
              {
                toastr.error("Ви вже маєте замовлення!","Помилка!")
              }
              if(result.data === "ok")
              {
                  setShowDate(true);
              }
            }
            catch(ex)
            {
              toastr.error("Помилка сервера!","Помилка!")
              console.log(ex)
            }
      }
      async function SetOrderClick()
      {
          if(f === "")
          {
            toastr.error("Введіть дату та час!","Помилка!")
          }
          else
          {
            var dat = new Date(f);
          console.log(f)
          if(!executeRecaptcha )
            return
            const reCaptchaToken = await executeRecaptcha()
            console.log(order)
          const values: IDriverSetOrder = {
            reCaptchaToken: reCaptchaToken,
            id: order.id,
            date: dat,
            email: user.email
          }
          try{
            setShowDate(false)
          const result = await http.post("api/orders/setDriverOrder",values);
          if(result.data === "ok")
          {
            toastr.success("Ви прийняли замовлення!","Успіх!")
            navigator("/ordersProfile")
          }
          if(result.data === "404")
          {
            toastr.error("Сталася помилка!","Помилка!")
          }
          console.log(result)
          }
          catch(ex)
          {
            console.log(ex)
            toastr.error("Помилка сервера!","Помилка!")
          }
        } 
      }

      function CareerModal({showDate, setShowDate}) {  
        const [d,setD] = useState("")
        function SetDateFromInput(event)
        {
            setD(event.target.value)
        }
        function ClearF()
        {
          f=""
        }
        function OnHandleSuccessClick()
        {
          f = d;
          SetOrderClick();
        }
        var t = new Date()
        let m = t.getMonth();
        m++
        var tString = ""
        tString = `${t.getFullYear()}-${m}-${t.getDate()}T01:20`
        return (
           
            <>
              <div className={classNames("modal",{"custom-modal": showDate})}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Введіть дату та час загрузки</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={()=>{setShowDate(false);ClearF()}}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <label>Дата та час:</label>&nbsp;
                      <input type="datetime-local" 
                      autoFocus={true} value={d} onChange={SetDateFromInput}
                      min={tString}
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={()=>{setShowDate(false);ClearF()}}
                      >
                        Скасувати
                      </button>
                      {
                         loading?
                         <EclipseWidgetContainer/>
                         :
                      <button type="button" className="btn btn-success" onClick={OnHandleSuccessClick}>
                        Прийняти
                      </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
      }
      const listOrders = s.map((item) => (
        <tr key={item.id}>
          <th  onClick={(e)=>{OnClickOrder(item)}}><img src={url+"api/account/files/32_"+item.image} alt=""/></th>
          <th  onClick={(e)=>{OnClickOrder(item)}}>{item.name}</th>
          <th  onClick={(e)=>{OnClickOrder(item)}}>{item.fromRegion}</th>
          <th  onClick={(e)=>{OnClickOrder(item)}}>{item.toRegion}</th>
          <th  onClick={(e)=>{OnClickOrder(item)}}>{item.weight}</th>
          <th  onClick={(e)=>{OnClickOrder(item)}}>{item.price} грн</th>
          {
            user.role === "driver"
            ?
            (
              <th><button type="button" className="btn btn-success" onClick={(e)=>{OnAcceptClick(item)}}>Прийняти</button></th>
            )
            :
            <></>
          }
        </tr>));
        const startListOrders = orders.map((item) => (
          <tr key={item.id}>
            <th  onClick={(e)=>{OnClickOrder(item)}}><img src={url+"api/account/files/32_"+item.image} alt=""/></th>
            <th  onClick={(e)=>{OnClickOrder(item)}}>{item.name}</th>
            <th  onClick={(e)=>{OnClickOrder(item)}}>{item.fromRegion}</th>
            <th  onClick={(e)=>{OnClickOrder(item)}}>{item.toRegion}</th>
            <th  onClick={(e)=>{OnClickOrder(item)}}>{item.weight}</th>
            <th  onClick={(e)=>{OnClickOrder(item)}}>{item.price} грн</th>
            {
              user.role === "driver"
              ?
              (
                <th><button type="button" className="btn btn-success" onClick={(e)=>{OnAcceptClick(item)}}>Прийняти</button></th>
              )
              :
              <></>
            }
          </tr>));

return(
  <div>
  <HomeLayout/>
  {
    !isAuth?
    (
      <div style={{textAlign:"center"}}>
              <h1>Вам необхідно авторизуватися!</h1>
              <br/>
              <button type="button" className="btn btn-success" onClick={OnLoginClick}>Вхід</button>
              &nbsp;&nbsp;&nbsp;
              <button type="button" className="btn btn-success" onClick={OnRegisterClick}>Реєстрація</button>
      </div>
    )
    :
    (
      <div>
        <h1  style={{textAlign:"center"}}>Замовлення</h1>
  {
    user !== undefined && user.role === "customer"
    ?
    (
      <div style={{margin:"10px",textAlign:"right"}}> 
        <button type="button" className="btn btn-primary" onClick={OnAddClick}>Додати замовелння</button>
      </div>
    )
    :
    <div></div>
  }
  {
    showDate?
    (
      <CareerModal
        setShowDate={setShowDate}
        showDate = {showDate}/>
    )
    :
     <></>
    }
  {
    loading?
    <EclipseWidgetContainer/>
    :
    (
      <div style={{margin:"10px",marginRight:"20px"}}>
        <div style={{margin: "10px", textAlign:"left"}}>
          <p>Сортувати за: &nbsp;
            <select value={valueSort} onChange={OnChangeSort}>
              <option value="default" disabled={true}>Виберіть як сортувати</option>
              <option value="priceUp">Ціною &#8593;</option>
              <option value="priceDown">Ціною &#8595;</option>
              <option value="weightUp">Вагою &#8593;</option>
              <option value="weightDown">Вагою &#8595;</option>
              <option value="fromRegionUp">Місцем відправки &#8593;</option>
              <option value="fromRegionDown">Місцем відправки &#8595;</option>
              <option value="toRegionUp">Місцем доставки &#8593;</option>
              <option value="toRegionDown">Місцем доставки &#8595;</option>
            </select>
          </p>
        </div>
        <div style={{margin: "10px", textAlign:"right"}}>
          <input type="text" value = {search} placeholder="Пошук..." onChange={OnChangeSearch}/>
          </div>
    {
      warningSearch !== ""
      ?
      <h1>{warningSearch}</h1>
      :
      (
        <table className="table table-dark table-hover" >
    <thead>
    <tr>
    <th scope="col">Фото</th>
              <th scope="col">Назва</th>
              <th scope="col">Звідки</th>
              <th scope="col">Куди</th>
              <th scope="col">Вага/об`єм</th>
              <th scope="col">Ціна</th>
              {
                user.role === "driver"
                ?
                <th scope="col"></th>
                :
                <></>
              }
    </tr>
  </thead>
      <tbody>
    {
      s.length>0?
      listOrders
      :
      startListOrders
    }
    </tbody>
    </table>
      )
    }
    </div>
    )
  }
    
  
      </div>
    )
}

  </div>

)
}
export default OrdersView