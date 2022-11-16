import * as React from "react";
import http from "../../http.common"
import HomeLayout from "../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import { useNavigate } from 'react-router-dom';
import DeleteUser from "../DeleteUser/index.tsx";



const CurrentUserView: React.FC = () =>{
    
    const {currentUser} = useTypedSelector(store=>store.currentUser)
    const url = http.defaults.baseURL
    const {selected} = useTypedSelector(store=>store.currentUser) 
    const {user} = useTypedSelector(store=>store.auth)
    const navigator = useNavigate()
    const [showDel,setShowDel] = React.useState<boolean>(false)
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
                                        <DeleteUser
        
                                    isClick = {true}/>
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
