import * as React from "react";
import http from "../../../http.common.js"
import HomeLayout from "../../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import UserNavbar from "../../userPanel/index.tsx";

const ProfileInfo: React.FC = () =>{
    const {user} = useTypedSelector(store=>store.auth)
    const url = http.defaults.baseURL
    
    return(
        <div>
        <HomeLayout/>
        <UserNavbar/>
        <div style={{textAlign:"center"}}>
        {user.role==="admin"?
            <h1>Адмін</h1>
            :
            user.role==="driver"?
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
}

export default ProfileInfo
