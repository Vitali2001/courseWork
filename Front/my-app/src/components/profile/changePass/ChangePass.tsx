import { FormikProvider, useFormik,Form } from 'formik';
import classNames from "classnames";
import React, { useState } from 'react'
import HomeLayout from "../../../containers/Navbar/index.tsx"
import UserNavbar from "../../userPanel/index.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import { IUserChangePassword } from './types';
import http from "../../../http.common.js";
import { Validator } from "./validation.ts";
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../../Eclipse/index.tsx";
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"

const ChangePass: React.FC = () =>{
   
    const initValues: IUserChangePassword = {
        email: "",
        oldPassword: "",
        newPassword: "",
        reNewPassword: "",
        recaptchaToken: ""
    }
    const navigator = useNavigate();
    const {isAuth} = useTypedSelector(store=>store.auth) 
    const {user} = useTypedSelector(store=>store.auth)
    const {executeRecaptcha } = useGoogleReCaptcha();
    const [isLoad, setLoad] = useState<boolean>(false);
    const onHandleSubmit = async(values: IUserChangePassword)=>{
        setLoad(prev=>!prev)
        console.log(isLoad)
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()

        values.recaptchaToken = reCaptchaToken
        values.email = user.email;
    
        console.log("Send data server",values)

       if(values.newPassword === values.reNewPassword)
       {
        try{
            const result = await http.post("api/account/changePassword",values);
            console.log("Create user result: ",result.data)
            if(result.data === "Старий пароль введено не вірно!"){
                setLoad(prev=>!prev)
                toastr.error("Старий пароль введено не вірно!","Помилка зміни пароля!")
            }
            else{
                setLoad(prev=>!prev)
                toastr.success("Пароль змінено успішно!","Зміна пароля!")
                    navigator("/profile") 
                
            }
        }
        catch(ex){
            setLoad(prev=>!prev)
            console.log("Server problem",ex)
            toastr.error("Сервер не відповідає!","Помилка зміни пароля!")
        }
       }
       else
       {
        setLoad(prev=>!prev)
        toastr.error("Паролі не співпадають!","Помилка зміни пароля!")
       }
    }
    const formik = useFormik({
        initialValues: initValues,
        onSubmit: onHandleSubmit,
        validationSchema: Validator
    })
    const {handleChange,handleSubmit,errors, touched} = formik
    
    return(
        <div>
            {
                isAuth
                ?
                (
                    <div className="row">
            <HomeLayout/>
            <UserNavbar/>
            
            <div className="offset-md-3 col-md-6">
                <h1 className="text-center">
                Зміна пароля
                </h1>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
                        
                    <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">
                Старий пароль
              </label>
              <input type="password" 
                  className= { classNames("form-control",
                      {"is-invalid": touched.oldPassword && errors.oldPassword},
                      {"is-valid": touched.oldPassword && !errors.oldPassword}
                  )}
                  id="oldPassword"
                  name="oldPassword"
                  onChange={handleChange}
                  />
                  {touched.oldPassword && errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
            </div>
           <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Новий пароль
              </label>
              <input type="password" 
                  className= { classNames("form-control",
                      {"is-invalid": touched.newPassword && errors.newPassword},
                      {"is-valid": touched.newPassword && !errors.newPassword}
                  )}
                  id="newPassword"
                  name="newPassword"
                  onChange={handleChange}
                  />
                  {touched.newPassword && errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="reNewPassword" className="form-label">
                Повторіть новий пароль
              </label>
              <input type="password" 
                  className= { classNames("form-control",
                      {"is-invalid": touched.reNewPassword && errors.reNewPassword},
                      {"is-valid": touched.reNewPassword && !errors.reNewPassword}
                  )}
                  id="reNewPassword"
                  name="reNewPassword"
                  onChange={handleChange}
                  />
                  {touched.reNewPassword && errors.reNewPassword && <div className="invalid-feedback">{errors.reNewPassword}</div>}
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
                    <h1>Вам необхідно авторизувaтись</h1>
                </div>           
            }
        </div>
    )
}

export default ChangePass