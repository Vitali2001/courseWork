import * as React from "react";
import http from "../../http.common"
import HomeLayout from "../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"


const CurrentUserView: React.FC = () =>{
    const {user} = useTypedSelector(store=>store.currentUser)
    const url = http.defaults.baseURL
    const {selected} = useTypedSelector(store=>store.currentUser) 
    
    return(
        <div>
            {
                selected
                ?
                (
                    <div className="row">
                        <HomeLayout/>
                    <div style={{textAlign:"center"}}>
                    {user.role==="driver"?
                        <h1>Водій</h1>
                        :
                        <h1>Замовник</h1> 
                    }
                    <img src={url+"api/account/files/1200_"+user.image} alt="" />
                    <h1>{user.lastName}</h1>
                    <h2>{user.firstName}</h2>
                    <h2>{user.middleName}</h2>
                    <h3>{user.email}</h3>
                    <h3>{user.address}</h3>
                    </div>
                    </div>
                )
                :
                <div className="row">
                <HomeLayout/>
                <h1>Вам необхідно авторизувaтись</h1>
                </div>
            }
        </div>
    )
}

export default CurrentUserView
