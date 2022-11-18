import { FormikProvider, useFormik,Form } from 'formik';
import React, { useState } from 'react'
import { IOrderCreate } from './types';
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
import SelectRegionComponent from '../../containers/SelectRegionComponent/index.tsx';
import classNames from 'classnames';

export const CreateOrderLayout: React.FC = () => {
    const initValues: IOrderCreate = {
        name: "",
        fromRegion: "",
        fromCity: "",
        fromAddress: "",
        toRegion: "",
        toCity: "",
        toAddress: "",
        weight: "",
        image: "",
        price: 0,
        emailCustomer: "",
        recaptchaToken: ""
    }
    const {user} = useTypedSelector(store=>store.auth)
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const navigator = useNavigate();
    const onHandleSubmit = async(values: IOrderCreate)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        values.emailCustomer = user.email
        values.recaptchaToken = reCaptchaToken
        console.log("Send data server",values)
        try{

            const result = await http.post("api/orders/addOrder",values);
            console.log("Create user result: ",result.data)
            if(result.data === "404"){
                setLoad(prev=>!prev)
                toastr.error("Сервер не відповідає!","Помилка додавання!")
            }
            else{
                console.log(result.data)
                setLoad(prev=>!prev)
                toastr.success("Ви додали замовлення!","Додавання замовлення")
            navigator("/orders")
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
            user!==undefined && user.role ==="customer"
            ?
            (
               <div className="offset-md-3 col-md-6">
                <h1 className="text-center">
                Додавання замовлення
                </h1>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
                        <h1>Звідки:</h1>
                        <SelectRegionComponent
                        inputName="fromRegion"
                        title="Область"
                        touched={touched.fromRegion}
                        errors={errors.fromRegion}
                        handleChange={handleChange}
                    />
                    <InputComponent
                            inputName="fromCity"
                            title="Місто/Населенний пункт"
                            touched={touched.fromCity}
                            errors={errors.fromCity}
                            handleChange={handleChange}
                            />
                        <InputComponent
                            inputName="fromAddress"
                            title="Адреса"
                            touched={touched.fromAddress}
                            errors={errors.fromAddress}
                            handleChange={handleChange}
                            />
                    <h1>Куди:</h1>
                    <SelectRegionComponent
                        inputName="toRegion"
                        title="Область"
                        touched={touched.toRegion}
                        errors={errors.toRegion}
                        handleChange={handleChange}
                    />
                    <InputComponent
                            inputName="toCity"
                            title="Місто/Населенний пункт"
                            touched={touched.toCity}
                            errors={errors.toCity}
                            handleChange={handleChange}
                            />
                        <InputComponent
                            inputName="toAddress"
                            title="Адреса"
                            touched={touched.toAddress}
                            errors={errors.toAddress}
                            handleChange={handleChange}
                            />
                            <InputComponent
                            inputName="name"
                            title="Назва товару"
                            touched={touched.name}
                            errors={errors.name}
                            handleChange={handleChange}
                            />
                            <InputComponent
                            inputName="weight"
                            title="Вага/об`єм"
                            touched={touched.weight}
                            errors={errors.weight}
                            handleChange={handleChange}
                            />
                            <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            Ціна
                        </label>
                        <input type="number" 
                            className= { classNames("form-control",
                                {"is-invalid": touched.price && errors.price},
                                {"is-valid": touched.price && !errors.price}
                            )}
                            id="price"
                            name="price"
                            onChange={handleChange}
                            />
                            {touched.price && errors.price && <div className="invalid-feedback">{errors.price}</div>}
                        </div>
                        <div className = "mb-3">
                        <label htmlFor="image" className="form-label">Фото товару:</label>
                        &nbsp;&nbsp;
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
            <div style={{textAlign:"center"}}>
                <h1>Сталася помилка!</h1>
            </div>
           }
            
        </div>
        
    );
};
