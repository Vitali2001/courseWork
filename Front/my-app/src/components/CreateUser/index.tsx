import { FormikProvider, useFormik,Form } from 'formik';
import React from 'react'
import { IUserCreate } from './types';
import http from '../../http.common';
import CropperDialog from "../CropperDialog/index.tsx";
import InputComponent from "../InputComponent/index.tsx";
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../containers/home/index.tsx';
import toastr from 'toastr';
import "toastr/build/toastr.css"


const CreateUserPage = () => {
    const initValues: IUserCreate = {
        image: "",
        age: 0,
        email: "",
        phone: "",
        password: ""
    }
    const navigator = useNavigate();
    const onHandleSubmit = async(values: IUserCreate)=>{
        console.log("Send data server",values)
        try{
            const result = await http.post("create",values);
            console.log("Create user result: ",result.data)
            toastr.success("Ви додали нового користувача","Додавання користувача")
            navigator("/")
        }
        catch(ex){
            console.log("Server problem",ex)
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
                Додати користувача
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
                            inputName="age"
                            title="Вік"
                            touched={touched.age}
                            errors={errors.age}
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
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">
                                Додати
                            </button>
                        </div>
                    </Form>
                </FormikProvider>
                
            </div>
            
        </div>
        
    );
};

export default CreateUserPage;