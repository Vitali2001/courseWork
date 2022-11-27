import * as React from "react";
import { Link } from "react-router-dom";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"

const UserPanel: React.FC = () =>{
    const user = useTypedSelector(store=>store.auth)
    console.log(user.user.role)

    return(
        <nav className="navbar navbar-expand-lg bg-light">
    <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
            <li className="nav-item">
            <Link className="nav-link" to="/profile">
                  Інформація
            </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link " to="/profileUpdate">
                  Редагувати профіль
            </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link " to="/changePassword">
                  Змінити пароль
            </Link>
            </li>
            {
                user.user.role !== "admin"
                ?
                <li className="nav-item">
                            <Link className="nav-link " to="/ordersProfile">
                                Мої замовленя
                            </Link>            
                </li>
                :
                <></>
            }
        </ul>
        </div>
    </div>
</nav>
    )
}

export default UserPanel; 