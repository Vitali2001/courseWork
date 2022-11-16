import React, { useEffect, useState } from "react";
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
    const [s,setS] = useState(Array<ICustomerItem>)
    const [warningSearch, setWarningSearch] = useState("");
    const [search,setSearch] = useState('')
    const [valueSort, setValuesort] = useState('default');
    const {user} = useTypedSelector(store=>store.auth)

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
      function OnAddCustomer(){
        navigator("/add_customer")
      }
      let arrs: ICustomerItem = []
      function OnChangeSearch(event){
        setSearch(event.target.value);
        
        list.forEach(function(item: ICustomerItem){
          let lName : string = item.lastName
          let fName : string = item.firstName
          let mName : string = item.middleName
          if(lName.toLowerCase().includes(event.target.value.toLowerCase())
            || fName.toLowerCase().includes(event.target.value.toLowerCase())
            || mName.toLowerCase().includes(event.target.value.toLowerCase())){
            arrs.push(item)
          }

       })
       setS(arrs)
       if(event.target.value !== "" && arrs.length < 1){
        setWarningSearch("Нічого не знайдено")
       }
       else
       {
        setWarningSearch("")
       }
      }
      function byFieldUp(field) {
        return (a, b) => a[field] > b[field] ? 1 : -1;
      }
      function byFieldDown(field) {
        return (a, b) => a[field] < b[field] ? 1 : -1;
      }
      function OnChangeSort(event)
      {
        setValuesort(event.target.value)
        console.log(event.target.value)
        let arr = list;
        if(event.target.value === "nameDown")
        {
          arr.sort(byFieldUp("firstName"))
          setS(arr)
        }
        if(event.target.value === "nameUp")
        {
          arr.sort(byFieldDown("firstName"))
          setS(arr)
        }
        if(event.target.value === "lastNameDown")
        {
          arr.sort(byFieldUp("lastName"))
          setS(arr)
        }
        if(event.target.value === "lastNameUp")
        {
          arr.sort(byFieldDown("lastName"))
          setS(arr)
        }
        if(event.target.value === "middleNameDown")
        {
          arr.sort(byFieldUp("middleName"))
          setS(arr)
        }
        if(event.target.value === "middleNameUp")
        {
          arr.sort(byFieldDown("middleName"))
          setS(arr)
        }
      }

      const listUser = s.map((item) => (
        <tr key={item.email} onClick={(e)=>OnClickCustomer(item)}>
          <th><img src={url+"api/account/files/150_"+item.image} alt=""/></th>
          <th>{item.lastName}</th>
          <th>{item.firstName}</th>
          <th>{item.middleName}</th>
        </tr>
      ));
      const startListUser = list.map((item) => (
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
          user !== undefined && user.role === "admin"
          ?
          (
            <div style={{margin:"10px",textAlign:"right"}}> 
              <button type="button" className="btn btn-primary" onClick={OnAddCustomer}>Додати замовника</button>
            </div>
          )
          :
          <div></div>
        }
      {
        loading?
        <EclipseWidgetContainer/>
        :
        (
          <div style={{margin:"10px",marginRight:"20px"}}>
            <div style={{margin: "10px", textAlign:"left"}}>
                <p>Сортувати за: &nbsp;
                  <select value={valueSort} onChange={OnChangeSort}>
                    <option value="default" disabled={true}>Виберіть як сортувати</option>
                    <option value="nameUp">Ім`ям &#8593;</option>
                    <option value="nameDown">Ім`ям &#8595;</option>
                    <option value="lastNameUp">Прізвищем &#8593;</option>
                    <option value="lastNameDown">Прізвищем &#8595;</option>
                    <option value="middleNameUp">По-батькові &#8593;</option>
                    <option value="middleNameDown">По-батькові &#8595;</option>
                  </select>
                </p>
              </div>
            <div style={{margin: "10px", textAlign:"right"}}>
              <input type="text" value = {search} placeholder="Пошук..." onChange={OnChangeSearch}/>
              </div>
        {
          warningSearch !== ""
          ?
          <h1>{warningSearch}</h1>
          :
          (
            <table className="table table-dark table-hover" >
        <thead>
        <tr>
          <th scope="col">Фото</th>
          <th scope="col">Прізвище</th>
          <th scope="col">Ім`я</th>
          <th scope="col">По-батькові</th>
        </tr>
      </thead>
          <tbody>
        {
          s.length>0?
          listUser
          :
          startListUser
        }
        </tbody>
        </table>
          )
        }
        </div>
        )
      }
      </div>

    )
}

export default CustomersView