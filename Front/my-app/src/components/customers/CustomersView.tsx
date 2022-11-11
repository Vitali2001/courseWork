import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import {ICustomerItem} from "./types.ts"
import axios from "axios"
import http from "../../http.common"
import EclipseWidgetContainer from "../../components/Eclipse/index.tsx"
import { useNavigate } from 'react-router-dom';

const CustomersView: React.FC = () =>{
   
    const navigator = useNavigate()
    const {list, loading} = useTypedSelector(store=>store.customers); 
    const dispatch = useDispatch();
    const url = http.defaults.baseURL

    useEffect(() => {
      dispatch({
        type: "CLEAR_CURRENT_USER"
      })
        dispatch({
          type: "CLEAR_TABLE"
        })
        dispatch({
            type: "GET_LIST_CUSTOMER",
          });
          axios.get<Array<ICustomerItem>>("http://localhost:8080/api/users/customers").then((resp) => {
            dispatch({
              type: "GET_LIST_CUSTOMER_SUCCESS",
              payload: resp.data,
            });
           
          });
        
      },[dispatch]);
      function OnClickCustomer(item : any){
        dispatch({
          type: "SET_CURRENT_USER",
          payload: item
        })
        navigator("/current_user")
      }

      const listUser = list.map((item) => (
        <tr key={item.email} onClick={(e)=>OnClickCustomer(item)}>
          <th><img src={url+"api/account/files/150_"+item.image} alt=""/></th>
          <th>{item.lastName}</th>
          <th>{item.firstName}</th>
          <th>{item.middleName}</th>
        </tr>
      ));
    

    return(
        <div>
        <HomeLayout/>
        <h1  style={{textAlign:"center"}}>Замовники</h1>
        {
          loading?
          <EclipseWidgetContainer/>
          :
          (
            <div style={{margin:"10px",marginRight:"20px"}}>
          <table className="table table-dark table-hover" >
          
            <tbody>
          {listUser}
          </tbody>
          </table>
          </div>
          
          )
        }
        </div>
    )
}

export default CustomersView