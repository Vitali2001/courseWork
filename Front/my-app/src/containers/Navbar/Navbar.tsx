import * as React from "react";
import { Link } from "react-router-dom";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
/* import { store } from "../../../store/index.ts"; */
import http from "../../http.common.js"

const Navbar: React.FC = () => {

  const {isAuth,user} = useTypedSelector(store=>store.auth)
  const url = http.defaults.baseURL

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container" style={{marginLeft: "0px"}}>
        <Link className="navbar-brand" to="/home">
            Перевезення вантажів
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                {/* {isAuth?(
                  <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/create"
                >
                 
                </Link>
                ):
                ""} */}
              </li>
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
              <Link className="nav-link active" to="/products/create">
                  
              </Link>
              </li>
              </ul>
            </ul>
            {isAuth?(
              <ul className="navbar-nav"style={{margin:"-100px"}}>
              <li className="nav-item">
                <Link className="nav-link" to="/profile" >
                <img src={url+"api/account/files/32_"+user?.image} style={{borderRadius:"100px", margin:"-5px"}}
                 width="40px" alt=""/>
                </Link>
              </li>
              <li className="nav-item" style={{marginLeft:"20px"}}>
                <Link className="nav-link" to="/logout">
                  Вихід
                </Link>
              </li>
            </ul>
            ):
            <ul className="navbar-nav" style={{margin:"-90px"}}>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Вхід
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Реєстрація
              </Link>
            </li>
          </ul>
          }
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;