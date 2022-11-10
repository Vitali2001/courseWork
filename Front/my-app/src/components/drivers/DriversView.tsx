import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import {IDriverItem} from "./types.ts"
import axios from "axios"

const DriversView: React.FC = () =>{
   
    const {list, loading} = useTypedSelector(store=>store.drivers); 
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("ds")
        dispatch({
          type: "CLEAR_TABLE"
        })
        dispatch({
            type: "GET_LIST_DRIVER",
          });
          axios.get<Array<IDriverItem>>("http://localhost:8080/api/users/drivers").then((resp) => {
            dispatch({
              type: "GET_LIST_DRIVER_SUCCESS",
              payload: resp.data,
            });
           
          });
        
      },[dispatch]);

    return(
        <>
        <HomeLayout/>
        <h1>Водії</h1>
        </>
    )
}

export default DriversView