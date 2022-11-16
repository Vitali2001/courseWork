import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import { IDriverCreate } from './types';
import http from "../../http.common";
import CropperDialog from "../CropperDialog/index.tsx";
import InputComponent from "../../containers/InputComponent/index.tsx";
import { Validator } from "./vallidation.ts";
import { useNavigate } from 'react-router-dom';
import HomeLayout from "../../containers/Navbar/index.tsx";
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../Eclipse/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useTypedSelector} from "../../hooks/usedTypedSelector.ts"

export const CreateDriverLayout: React.FC = () => {
    const initValues: IDriverCreate = {
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
    const {user} = useTypedSelector(store=>store.auth)
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const navigator = useNavigate();
    const onHandleSubmit = async(values: IDriverCreate)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        values.role = "driver"
        values.recaptchaToken = reCaptchaToken
        console.log("Send data server",values)
        try{

            const result = await http.post("api/users/addUser",values);
            console.log("Create user result: ",result.data)
            if(result.data === "Данний користувач вже є в системі"){
                setLoad(prev=>!prev)
                toastr.error("Водій зареєстрований!","Помилка додавання!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("Ви додали водія!","Додавання водія")
            navigator("/drivers")
            }
        }
        catch(ex){
            setLoad(prev=>!prev)
            console.log("Server problem",ex)
            toastr.error("Сервер не відповідає!","Помилка додавання!")
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
           {
            user.role ==="admin"
            ?
            (
               <div className="offset-md-3 col-md-6">
                <h1 className="text-center">
                Додавання водія
                </h1>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
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
                            Додати
                        </button>
                        }
                    </Form>
                </FormikProvider>
                
            </div>
            )
            :
            <div>
                <h1>Сталася помилка!</h1>
            </div>
           }
            
        </div>
        
    );
};
