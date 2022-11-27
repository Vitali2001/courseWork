import * as React from "react";
import http from "../../http.common"
import {IDeleteUser} from "./types.ts"
import HomeLayout from "../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import { useNavigate } from 'react-router-dom';
import classNames from "classnames";
import "./style.css";
import toastr from 'toastr';
import "toastr/build/toastr.css"
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { useDispatch } from "react-redux";
import EclipseWidgetContainer from "../Eclipse/index.tsx";




const CurrentUserView: React.FC = () =>{

    const [isLoad, setLoad] = React.useState<boolean>(false);
    const {isAuth} = useTypedSelector(store=>store.auth) 
    const dispatch = useDispatch();
    const {executeRecaptcha } = useGoogleReCaptcha();
    const {currentUser} = useTypedSelector(store=>store.currentUser)
    const url = http.defaults.baseURL
    const {selected} = useTypedSelector(store=>store.currentUser) 
    const {user} = useTypedSelector(store=>store.auth)
    const navigator = useNavigate()
    const [showDel,setShowDel] = React.useState<boolean>(false)
    const [email,setEmail] = React.useState('')
    React.useEffect(()=>{
        if(!selected)
        window.history.back();
    })
    function OnLoginClick()
       {
        navigator("/login")
       }
       function OnRegisterClick()
       {
          navigator("/register")
       }
    function OnDeleteClick(){
         setShowDel(p=>!p)
    }
    function OnUpdateClick(){
        if(currentUser.role === "driver")
        {
            navigator("/update_driver")
        }
        if(currentUser.role === "customer")
        {
            navigator("/update_customer")
        }
    }
    function SetEmailFromInput(event)
    {
        setEmail(event.target.value)
    }
    async function DeleteClick()
    {
        if(email !== currentUser.email)
        {
            toastr.error("Email не співпадає!","Помилка видалення!")
            setEmail("")
            setShowDel(false);
        }
        if(email === currentUser.email)
        {
            if(!executeRecaptcha )
            return
            const reCaptchaToken = await executeRecaptcha()
            const values: IDeleteUser = 
            {
                email: email,
                reCaptchaToken: reCaptchaToken
            };
            console.log(email)
            
            values.reCaptchaToken = reCaptchaToken
            try{
                const result = await http.post("api/users/deleteUser",values);
                if(result.data === ""){
                    setLoad(prev=>!prev)
                    toastr.error("Сервер не відповідає!","Помилка видалення!")
                    setEmail("")
                    setShowDel(false);
                }
                else{
                    setLoad(prev=>!prev)
                    toastr.success("Ви видалили користувача!","Видалення")
                    dispatch({
                        type: "CLEAR_CURRENT_USER"
                      })
                    setEmail("")
                    setShowDel(false);
                    window.history.back();
                    
                }
            }
            catch(ex){
                setLoad(prev=>!prev)
                console.log("Server problem",ex)
                toastr.error("Сервер не відповідає!","Помилка видалення!")
                setEmail("")
                setShowDel(false);
            }
        }
    }
    function CareerModal({showDel, setShowDel}) {  
        return (
            <>
              <div className={classNames("modal",{"custom-modal": showDel})}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Введіть email користувача</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={()=>{setShowDel(false);setEmail("")}}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <label>Email:</label>&nbsp;
                      <input type="text" autoFocus={true} value={email} onChange={SetEmailFromInput}/>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={()=>{setShowDel(false);setEmail("")}}
                      >
                        Скасувати
                      </button>
                      {
                         isLoad?
                         <EclipseWidgetContainer/>
                         :
                      <button type="button" className="btn btn-danger" onClick={DeleteClick}>
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
    

    return(
        <div>
            {
                selected && isAuth
                ?
                (
                    <div className="row">
                        <HomeLayout/>
                    <div style={{textAlign:"center",marginTop:"50px"}}>
                    <div className="card mb-3" style={{maxWidth:"1300px",textAlign:"center"}}>
                <div className="row g-0">
                    <div className="col-md-4">
                    <img src={url+"api/account/files/600_"+currentUser.image} style={{height:"400px"}} className="img-fluid rounded-start" alt="..." />
                    </div>
                    <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{currentUser.role==="admin"?
                <h1>Адмін</h1>
                :
                currentUser.role==="driver"?
                <h1>Водій</h1>
                :
                <h1>Замовник</h1>

            }</h5>
                        <h3 className="card-text">{currentUser.lastName}</h3>
                        <h3 className="card-text">{currentUser.firstName}</h3>
                        <h3 className="card-text">{currentUser.middleName}</h3>
                        <h3 className="card-text">{currentUser.email}</h3>
                        <h3 className="card-text">{currentUser.address}</h3>
                        <h3 className="card-text">{currentUser.phone}</h3>
                        <p className="card-text">{currentUser.raiting} &#11088;</p>
                    </div>
                    </div>
                </div>
                </div>
                    </div>
                    {
                        user !== undefined && user.role === "admin"
                        ?
                        (
                            <div style={{textAlign:"center",margin:"10px"}}>
                                <button type="button" className="btn btn-warning" onClick={OnUpdateClick}>Редагувати</button>
                                &nbsp;
                                <button type="button" className="btn btn-danger" onClick={OnDeleteClick}>Видалити</button>
                                {
                                    showDel?
                                    (
                                        <CareerModal
                                        setShowDel={setShowDel}
                                        showDel = {showDel}/>
                                    )
                                    :
                                    <div></div>
                                }
                            </div>
                        )
                        
                        :
                        <div></div>
                    }
                    </div>
                    
                )
                :
                <div style={{textAlign:"center"}}>
                    <HomeLayout/>
              <h1>Вам необхідно авторизуватися!</h1>
              <br/>
              <button type="button" className="btn btn-success" onClick={OnLoginClick}>Вхід</button>
              &nbsp;&nbsp;&nbsp;
              <button type="button" className="btn btn-success" onClick={OnRegisterClick}>Реєстрація</button>
      </div>
            }
        </div>
    )
}

export default CurrentUserView
