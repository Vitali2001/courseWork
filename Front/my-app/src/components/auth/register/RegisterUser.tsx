import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import { IUserCreate } from './types';
import http from "../../../http.common.js";
import CropperDialog from "../../CropperDialog/index.tsx";
import InputComponent from "../../../containers/InputComponent/index.tsx";
import SelectComponent  from '../../../containers/SelectComponent/index.tsx';
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../../containers/Navbar/index.tsx';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../../Eclipse/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"

export const RegisterUser: React.FC = () => {
    const initValues: IUserCreate = {
        image: "",
        address: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        lastName: "",
        firstName: "",
        middleName: "",
        recaptchaToken: ""
    }
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const navigator = useNavigate();
    const onHandleSubmit = async(values: IUserCreate)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        
        values.recaptchaToken = reCaptchaToken
        console.log("Send data server",values)
        try{
            const result = await http.post("api/account/register",values);
            console.log("Create user result: ",result.data)
            if(result.data === "Данний користувач вже є в системі"){
                setLoad(prev=>!prev)
                toastr.error("Помилка реєстрації!","Ви вже зареєстровані!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("Ви зареєструвалися!","Реєстрація")
            navigator("/login")
            }
        }
        catch(ex){
            setLoad(prev=>!prev)
            console.log("Server problem",ex)
            toastr.error("Помилка реєстрації!","Сервер не відповідає!")
        }
    }
    const formik = useFormik({
        initialValues: initValues,
        onSubmit: onHandleSubmit,
        validationSchema: Validator
    })
    const {handleChange,handleSubmit,errors, touched,setFieldValue} = formik
    return (
        
        <div className="row">
            <HomeLayout/>
            
            <div className="offset-md-3 col-md-6">
                <h1 className="text-center">
                Реєстрація
                </h1>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
                    <SelectComponent
                        inputName="role"
                        title="Роль"
                        touched={touched.role}
                        errors={errors.role}
                        handleChange={handleChange}
                    />
                    <InputComponent
                            inputName="email"
                            title="Пошта"
                            touched={touched.email}
                            errors={errors.email}
                            handleChange={handleChange}
                            />
                        <InputComponent
                            inputName="phone"
                            title="Tелефон"
                            touched={touched.phone}
                            errors={errors.phone}
                            handleChange={handleChange}
                            />

                            <InputComponent
                            inputName="lastName"
                            title="Прізвище"
                            touched={touched.lastName}
                            errors={errors.lastName}
                            handleChange={handleChange}
                            />
                            <InputComponent
                            inputName="firstName"
                            title="Ім`я"
                            touched={touched.firstName}
                            errors={errors.firstName}
                            handleChange={handleChange}
                            />
                            <InputComponent
                            inputName="middleName"
                            title="По-батькові"
                            touched={touched.middleName}
                            errors={errors.middleName}
                            handleChange={handleChange}
                            />
                            <InputComponent
                            inputName="address"
                            title="Адреса"
                            touched={touched.address}
                            errors={errors.address}
                            handleChange={handleChange}
                            />

                            <InputComponent
                            inputName="password"
                            title="Пароль"
                            touched={touched.password}
                            errors={errors.password}
                            handleChange={handleChange}
                            />
                        <div className = "mb-3">
                        <label htmlFor="image" className="form-label">Фото:</label>
                        &nbsp;
                        <CropperDialog
                        onChange={setFieldValue}
                        field="image"
                        error={errors.image}
                        touched={touched.image}
                            />
                        </div>

                        {
                        isLoad?
                        <EclipseWidgetContainer/>
                        :
                        <button type="submit" className="btn btn-primary">
                            Зареєеструватися
                        </button>
                        }
                    </Form>
                </FormikProvider>
                
            </div>
            
        </div>
        
    );
};
