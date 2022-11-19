import * as React from "react";
import http from "../../http.common"
import HomeLayout from "../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { useDispatch } from "react-redux";
import {IDriverIsOrder,IDriverSetOrder,IOrderCurrent} from "./types.ts"
import classNames from "classnames";
import "./style.css";



const CurrentOrderView: React.FC = () =>{

    const dispatch = useDispatch();
    const {executeRecaptcha } = useGoogleReCaptcha();
    const {currentOrder} = useTypedSelector(store=>store.currentOrder)
    const url = http.defaults.baseURL
    const {selected} = useTypedSelector(store=>store.currentOrder) 
    const {user} = useTypedSelector(store=>store.auth)
    const {list} = useTypedSelector(store=>store.customers)
    const navigator = useNavigate()
    const [showDate,setShowDate] = React.useState<boolean>(false)

    let f: IOrderCurrent = null;

    React.useEffect(()=>{
       if(!selected)
        window.history.back();

    })
    function OnCustomerClick(item: any)
    {
        dispatch({
            type: "SET_CURRENT_USER",
            payload: item
          })
          navigator("/current_user")
    }
    async function OnAcceptClick()
      {
        if(!executeRecaptcha )
            return
            const reCaptchaToken = await executeRecaptcha()
            const values: IDriverIsOrder = 
            {
                reCaptchaToken: reCaptchaToken,
                id: currentOrder.id,
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
          const values: IDriverSetOrder = {
            reCaptchaToken: reCaptchaToken,
            id: currentOrder.id,
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
        const [d,setD] = React.useState("")
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
                      <h5 className="modal-title">Введіть дату та час завантаження</h5>
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
                      <button type="button" className="btn btn-success" onClick={OnHandleSuccessClick}>
                        Прийняти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
      }
    const customer = list.map((item)=>(
        <div>
            {
                item.email === currentOrder.emailCustomer
                ?
                (
                    <div>
                        <img src={url+"api/account/files/600_"+item?.image} style={{borderRadius:"100px", margin:"-5px"}}
                 width="100px" alt="" onClick={(e)=>{OnCustomerClick(item)}}/>
                        <h2>{item.lastName}</h2>
                        <h2>{item.firstName}</h2>
                        <h2>{item.middleName}</h2>
                    </div>
                )
                :
                <></>
            }
        </div>
    ))
    return(
        <div>
            {
                selected
                ?
                (
                    <div className="row">
                        <HomeLayout/>
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
                    <div style={{textAlign:"center"}}>
                        <h1>Деталі замовлення</h1>
                        <h2>{currentOrder.name}</h2>
                    <img src={url+"api/account/files/1200_"+currentOrder.image} alt="" />
                    
                    <div style={{textAlign:"center"}}>
                    <h1>Точка завантаження:</h1>
                    <label>Область</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.fromRegion}/>
                    <br/>
                    <br/>
                    <label>Місто/населений пункт</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.fromCity}/>
                    <br/>
                    <br/>
                    <label>Точна адреса</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.fromAddress}/>
                    <h1>Точка прибуття:</h1>
                    <label>Область</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.toRegion}/>
                    <br/>
                    <br/>
                    <label>Місто/населений пункт</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.toCity}/>
                    <br/>
                    <br/>
                    <label>Точна адреса</label>
                    &nbsp;&nbsp;
                    <input type="text" readOnly={true} value={currentOrder.toAddress}/>
                    
                    </div>
                    <br/>
                    <h3>Ціна: {currentOrder.price} грн.</h3>
                    <hr/>
                    <h1>Замовник</h1>
                    {
                       customer
                    }
                    </div>
                    {
                        user !== undefined && user.role === "driver"
                        ?
                        (
                            <div style={{textAlign:"center",margin:"10px"}}>
                                <button type="button" className="btn btn-success" onClick={OnAcceptClick}>Прийняти</button>
                                &nbsp;
                            </div>
                        )
                        :
                        <div></div>
                    }
                    </div>
                    
                )
                :
                <div className="row">
                <HomeLayout/>
                <h1>Сталася помилка</h1>
                </div>
            }
        </div>
    )
}

export default CurrentOrderView
