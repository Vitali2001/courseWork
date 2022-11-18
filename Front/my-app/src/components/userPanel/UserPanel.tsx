import * as React from "react";
import { Link } from "react-router-dom";

const UserPanel: React.FC = () =>{
    

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
            <li className="nav-item">
            <Link className="nav-link " to="/ordersProfile">
                  Замовлення
            </Link>
            </li>
        </ul>
        </div>
    </div>
</nav>
    )
}

export default UserPanel; 