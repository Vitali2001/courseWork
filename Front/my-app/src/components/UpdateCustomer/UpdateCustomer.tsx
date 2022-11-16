import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import HomeLayout from "../../containers/Navbar/index.tsx"
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { ICustomerUpdate } from './types';
import http from "../../http.common";
import CropperDialog from "../CropperDialog/index.tsx";
import InputComponent from "../../containers/InputComponent/index.tsx";
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../Eclipse/index.tsx";
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"

export const UpdateCustomerLayout: React.FC = () =>{
   
    const initValues: ICustomerUpdate = {
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
    const onHandleSubmit = async(values: ICustomerUpdate)=>{
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
                toastr.error("Сервер не відповідає!","Помилка оновлення!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("Ви оновили данні!","Оновлення")
                
                    navigator("/customers") 
                
            }
        }
        catch(ex){
            setLoad(prev=>!prev)
            console.log("Server problem",ex)
            toastr.error("Сервер не відповідає!","Помилка оновлення!")
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
        
           {user !== undefined && user.role === "admin"
           ?
           (
            <div className="row">
            <HomeLayout/>
                 <div className="offset-md-3 col-md-6">
                 <h1 className="text-center">
                 Редагування профіля
                 </h1>
                 <FormikProvider value={formik}>
                     <Form onSubmit={handleSubmit}>
                         <InputComponent
                             inputName="phone"
                             title="Tелефон"
                             touched={touched.phone}
                             errors={errors.phone}
                             handleChange={handleChange}
                             defaultVal = {currentUser.phone}
                             />
                             <InputComponent
                             inputName="lastName"
                             title="Прізвище"
                             touched = "true"
                             handleChange={handleChange}
                             defaultVal={currentUser.lastName}
                             errors={errors.lastName}
                             />
                             <InputComponent
                             inputName="firstName"
                             title="Ім`я"
                             touched={touched.firstName}
                             errors={errors.firstName}
                             handleChange={handleChange}
                             defaultVal={currentUser.firstName}
                             />
                             <InputComponent
                             inputName="middleName"
                             title="По-батькові"
                             touched={touched.middleName}
                             errors={errors.middleName}
                             handleChange={handleChange}
                             defaultVal = {currentUser.middleName}
                             />
                             <InputComponent
                             inputName="address"
                             title="Адреса"
                             touched={touched.address}
                             errors={errors.address}
                             handleChange={handleChange}
                             defaultVal = {currentUser.address}
                             />
                         <div className = "mb-3">
                         <label htmlFor="image" className="form-label">Фото:</label>
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
                             Зберегти
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
                <h1>Сталася помилка</h1>
            </div>
           }
    </div>
    )
}

