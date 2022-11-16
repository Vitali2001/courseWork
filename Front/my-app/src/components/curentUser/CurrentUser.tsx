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
                selected
                ?
                (
                    <div className="row">
                        <HomeLayout/>
                    <div style={{textAlign:"center"}}>
                    {currentUser.role==="driver"?
                        <h1>Водій</h1>
                        :
                        <h1>Замовник</h1> 
                    }
                    <img src={url+"api/account/files/1200_"+currentUser.image} alt="" />
                    <h1>{currentUser.lastName}</h1>
                    <h2>{currentUser.firstName}</h2>
                    <h2>{currentUser.middleName}</h2>
                    <h3>{currentUser.email}</h3>
                    <h3>{currentUser.address}</h3>
                    <h3>{currentUser.phone}</h3>
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
                <div className="row">
                <HomeLayout/>
                <h1>Сталася помилка</h1>
                </div>
            }
        </div>
    )
}

export default CurrentUserView
