import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"
import {IDriverItem} from "./types.ts"
import axios from "axios"
import http from "../../http.common"
import EclipseWidgetContainer from "../../components/Eclipse/index.tsx"
import { useNavigate } from 'react-router-dom';


const DriversView: React.FC = () =>{
   
    const navigator = useNavigate()
    const [search,setSearch] = useState('')
    const {drivers, loading} = useTypedSelector(store=>store.drivers); 
    const [s,setS] = useState(Array<IDriverItem>)
    const dispatch = useDispatch();
    const [warningSearch, setWarningSearch] = useState("");
    const url = http.defaults.baseURL
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
            type: "GET_LIST_DRIVER",
          });
          axios.get<Array<IDriverItem>>("http://localhost:8080/api/users/drivers").then((resp) => {
            dispatch({
              type: "GET_LIST_DRIVER_SUCCESS",
              payload: resp.data,
            });
           
          });
        
      },[dispatch]);
      function OnAddDriver(){
        navigator("/add_driver")
      }
      function OnClickDriver(item : any){
        dispatch({
          type: "SET_CURRENT_USER",
          payload: item
        })
        navigator("/current_user")
      }
      let arrs: IDriverItem = []
      
      function OnChangeSearch(event){
        setSearch(event.target.value);
        
        drivers.forEach(function(item: IDriverItem){
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
        setWarningSearch("???????????? ???? ????????????????")
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
        let arr = drivers;
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
        if(event.target.value === "raitingUp")
        {
          arr.sort(byFieldUp("raiting"))
          setS(arr)
        }
        if(event.target.value === "raitingDown")
        {
          arr.sort(byFieldDown("raiting"))
          setS(arr)
        }
      }
      const listUser = s.map((item) => (
        <tr key={item.email} onClick={(e)=>OnClickDriver(item)}>
          <th><img src={url+"api/account/files/150_"+item.image} alt=""/></th>
          <th>{item.lastName}</th>
          <th>{item.firstName}</th>
          <th>{item.middleName}</th>
          <th>{item.raiting} &#11088;</th>
        </tr>));
      const startListUser = drivers.map((item) => (
        <tr key={item.email} onClick={(e)=>OnClickDriver(item)}>
          <th><img src={url+"api/account/files/150_"+item.image} alt=""/></th>
          <th>{item.lastName}</th>
          <th>{item.firstName}</th>
          <th>{item.middleName}</th>
          <th>{item.raiting} &#11088;</th>
        </tr>));

   return(
        <div>
        <HomeLayout/>
        <h1  style={{textAlign:"center"}}>??????????</h1>
        {
          user !== undefined && user.role === "admin"
          ?
          (
            <div style={{margin:"10px",textAlign:"right"}}> 
              <button type="button" className="btn btn-primary" onClick={OnAddDriver}>???????????? ??????????</button>
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
                <p>?????????????????? ????: &nbsp;
                  <select value={valueSort} onChange={OnChangeSort}>
                    <option value="default" disabled={true}>???????????????? ???? ??????????????????</option>
                    <option value="nameUp">????`???? &#8593;</option>
                    <option value="nameDown">????`???? &#8595;</option>
                    <option value="lastNameUp">?????????????????? &#8593;</option>
                    <option value="lastNameDown">?????????????????? &#8595;</option>
                    <option value="middleNameUp">????-???????????????? &#8593;</option>
                    <option value="middleNameDown">????-???????????????? &#8595;</option>
                    <option value="raitingUp">?????????????????? &#8593;</option>
                    <option value="raitingDown">?????????????????? &#8595;</option>
                  </select>
                </p>
              </div>
              <div style={{margin: "10px", textAlign:"right"}}>
                <input type="text" value = {search} placeholder="??????????..." onChange={OnChangeSearch}/>
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
            <th scope="col">????????</th>
            <th scope="col">????????????????</th>
            <th scope="col">????`??</th>
            <th scope="col">????-????????????????</th>
            <th scope="col">??????????????</th>
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

export default DriversView