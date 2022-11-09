import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"

const LogOut = ()=>{

    const navigator = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        localStorage.removeItem("token");
        dispatch({
            type: "LOGIN_OUT"
          });
        navigator("/login")
    })
    return(
        <div className="spinner-border" role="status">
        <span className="sr-only"></span>
        </div>
    )
}

export default LogOut