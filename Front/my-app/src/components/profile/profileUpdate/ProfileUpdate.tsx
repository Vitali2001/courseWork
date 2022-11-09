import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { IUserUpdate } from './types';
import http from "../../../http.common.js";
import CropperDialog from "../../CropperDialog/index.tsx";
import InputComponent from "../../../containers/InputComponent/index.tsx";
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../../Eclipse/index.tsx";
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import {useDispatch} from "react-redux"

export const ProfileUpdate: React.FC = () =>{
   
    const initValues: IUserUpdate = {
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
    const dispatch = useDispatch();
    const url = http.defaults.baseURL
    const {user} = useTypedSelector(store=>store.auth)
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const onHandleSubmit = async(values: IUserUpdate)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        console.log(user.image)
        values.recaptchaToken = reCaptchaToken
        values.email = user.email;
        if(values.address === "")
        {
            values.address = user.address
        }
        if(values.lastName ==="")
        {
            values.lastName = user.lastName
        }
        if(values.firstName ==="")
        {
            values.firstName = user.firstName
        }
        if(values.middleName === "")
        {
            values.middleName = user.middleName
        }
        if(values.phone === "")
        {
            values.phone = user.phone
        }
        values.role = user.role
        console.log("Send data server",values)
       try{
            const result = await http.post("api/account/update",values);
            console.log("Create user result: ",result.data)
            const dataUser = result.data;
            if(result.data === ""){
                setLoad(prev=>!prev)
                toastr.error("Сервер не відповідає!","Помилка оновлення!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("Ви оновили данні!","Оновлення")
                
                    dispatch({
                        type: "USER_UPDATE_SUCCESS",
                        payload: dataUser
                      });
                    navigator("/profile") 
                
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
        <div className="row">
            <HomeLayout/>
            <UserNavbar/>
            
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
                            defaultVal = {user.phone}
                            />
                            <InputComponent
                            inputName="lastName"
                            title="Прізвище"
                            touched = "true"
                            handleChange={handleChange}
                            defaultVal={user.lastName}
                            errors={errors.lastName}
                            />
                            <InputComponent
                            inputName="firstName"
                            title="Ім`я"
                            touched={touched.firstName}
                            errors={errors.firstName}
                            handleChange={handleChange}
                            defaultVal={user.firstName}
                            />
                            <InputComponent
                            inputName="middleName"
                            title="По-батькові"
                            touched={touched.middleName}
                            errors={errors.middleName}
                            handleChange={handleChange}
                            defaultVal = {user.middleName}
                            />
                            <InputComponent
                            inputName="address"
                            title="Адреса"
                            touched={touched.address}
                            errors={errors.address}
                            handleChange={handleChange}
                            defaultVal = {user.address}
                            />
                        <div className = "mb-3">
                        <label htmlFor="image" className="form-label">Фото:</label>
                        &nbsp;
                        <CropperDialog
                        onChange={setFieldValue}
                        field="image"
                        touched={touched.image}
                        currentImg = {url+"api/account/files/600_"+user.image}
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
}

