import * as React from "react";
import http from "../../../http.common.js"
import HomeLayout from "../../../containers/Navbar/index.tsx";
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import UserNavbar from "../../userPanel/index.tsx";

const ProfileInfo: React.FC = () =>{
    const {user} = useTypedSelector(store=>store.auth)
    const url = http.defaults.baseURL
    const {isAuth} = useTypedSelector(store=>store.auth) 
    
    return(
        <div>
            {isAuth
            ?
            (
                <div className="row">
            <HomeLayout/>
            <UserNavbar/>
            <div style={{textAlign:"center"}}>

            <div className="card mb-3" style={{maxWidth:"1300px",textAlign:"center",marginLeft:"60px"}}>
                <div className="row g-0">
                    <div className="col-md-4">
                    <img src={url+"api/account/files/600_"+user.image} style={{height:"400px"}} className="img-fluid rounded-start" alt="..." />
                    </div>
                    <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{user.role==="admin"?
                <h1>Адмін</h1>
                :
                user.role==="driver"?
                <h1>Водій</h1>
                :
                <h1>Замовник</h1>

            }</h5>
                        <h3 className="card-text">{user.lastName}</h3>
                        <h3 className="card-text">{user.firstName}</h3>
                        <h3 className="card-text">{user.middleName}</h3>
                        <h3 className="card-text">{user.email}</h3>
                        <h3 className="card-text">{user.address}</h3>
                        <h3 className="card-text">{user.phone}</h3>
                        <p className="card-text">{user.raiting} &#11088;</p>
                    </div>
                    </div>
                </div>
                </div>
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

export default ProfileInfo
