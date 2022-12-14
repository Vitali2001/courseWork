import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { IDriverUpdate } from './types';
import http from "../../http.common";
import CropperDialog from "../CropperDialog/index.tsx";
import InputComponent from "../../containers/InputComponent/index.tsx";
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../Eclipse/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"

export const UpdateDriverLayout: React.FC = () =>{
   
    const initValues: IDriverUpdate = {
        image: "",
        address: "",
        email: "",
        phone: "",
        lastName: "",
        firstName: "",
        middleName: "",
        recaptchaToken: "",
        role:""
    }
    const navigator = useNavigate();
    const url = http.defaults.baseURL
    const {user} = useTypedSelector(store=>store.auth)
    const {currentUser} = useTypedSelector(store=>store.currentUser) 
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const onHandleSubmit = async(values: IDriverUpdate)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        console.log(currentUser.image)
        values.recaptchaToken = reCaptchaToken
        values.email = currentUser.email;
        if(values.address === "")
        {
            values.address = currentUser.address
        }
        if(values.lastName ==="")
        {
            values.lastName = currentUser.lastName
        }
        if(values.firstName ==="")
        {
            values.firstName = currentUser.firstName
        }
        if(values.middleName === "")
        {
            values.middleName = currentUser.middleName
        }
        if(values.phone === "")
        {
            values.phone = currentUser.phone
        }
        values.role = currentUser.role
        console.log("Send data server",values)
       try{
            const result = await http.post("api/users/updateUser",values);
            console.log("Create user result: ",result.data)
            if(result.data === ""){
                setLoad(prev=>!prev)
                toastr.error("???????????? ???? ????????????????????!","?????????????? ??????????????????!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("???? ?????????????? ??????????!","??????????????????")
                
                    navigator("/drivers") 
                
            }
        }
        catch(ex){
            setLoad(prev=>!prev)
            console.log("Server problem",ex)
            toastr.error("???????????? ???? ????????????????????!","?????????????? ??????????????????!")
        }
    }
    const formik = useFormik({
        initialValues: initValues,
        onSubmit: onHandleSubmit,
        validationSchema: Validator
    })
    const {handleChange,handleSubmit,errors, touched,setFieldValue} = formik
    
    return(
        <div>
        
           {user !== undefined &&  user.role === "admin"
           ?
           (
            <div className="row">
            <HomeLayout/>
                 <div className="offset-md-3 col-md-6">
                 <h1 className="text-center">
                 ?????????????????????? ??????????????
                 </h1>
                 <FormikProvider value={formik}>
                     <Form onSubmit={handleSubmit}>
                         <InputComponent
                             inputName="phone"
                             title="T????????????"
                             touched={touched.phone}
                             errors={errors.phone}
                             handleChange={handleChange}
                             defaultVal = {currentUser.phone}
                             />
                             <InputComponent
                             inputName="lastName"
                             title="????????????????"
                             touched = "true"
                             handleChange={handleChange}
                             defaultVal={currentUser.lastName}
                             errors={errors.lastName}
                             />
                             <InputComponent
                             inputName="firstName"
                             title="????`??"
                             touched={touched.firstName}
                             errors={errors.firstName}
                             handleChange={handleChange}
                             defaultVal={currentUser.firstName}
                             />
                             <InputComponent
                             inputName="middleName"
                             title="????-????????????????"
                             touched={touched.middleName}
                             errors={errors.middleName}
                             handleChange={handleChange}
                             defaultVal = {currentUser.middleName}
                             />
                             <InputComponent
                             inputName="address"
                             title="????????????"
                             touched={touched.address}
                             errors={errors.address}
                             handleChange={handleChange}
                             defaultVal = {currentUser.address}
                             />
                         <div className = "mb-3">
                         <label htmlFor="image" className="form-label">????????:</label>
                         &nbsp;
                         <CropperDialog
                         onChange={setFieldValue}
                         field="image"
                         touched={touched.image}
                         currentImg = {url+"api/account/files/600_"+currentUser.image}
                             />
                         </div>
 
                         {
                         isLoad?
                         <EclipseWidgetContainer/>
                         :
                         <button type="submit" className="btn btn-primary">
                             ????????????????
                         </button>
                         }
                     </Form>
                 </FormikProvider>
                </div>
                
        </div>
           )
           :
            <div className="row">
                <HomeLayout/>
                <h1>?????????????? ??????????????</h1>
            </div>
           }
    </div>
    )
}

