import classNames from "classnames";
import { Form, FormikProvider, useFormik } from "formik";
import { ILogin } from "./types.ts";
import { LoginSchema } from "./validation.ts";
import {React} from "react"
import { useActions } from "../../../hooks/usedActions.ts";
import HomeLayout from "../../../containers/Navbar/index.tsx";
import { useNavigate } from "react-router-dom";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useTypedSelector} from "../../../hooks/usedTypedSelector.ts"
import toastr from 'toastr';
import "toastr/build/toastr.css"
import EclipseWidgetContainer from "../../Eclipse/index.tsx";


export const LoginPage: React.FC = () => {

    const {executeRecaptcha } = useGoogleReCaptcha();
   
    const {LoginUser} = useActions()
    const navigator = useNavigate();
    const loading = useTypedSelector(store=>store.auth.loading)
    

   const initialValues: ILogin = {       
       email:"",       
       password:""
   }

   const onHandleSubmit = async (values: ILogin) =>
   {
        if(!executeRecaptcha )
        return
        const reCaptchaToken = await executeRecaptcha()
        
       values.recaptchaToken = reCaptchaToken
       try{
        await LoginUser(values)
        navigator("/home");
       }
       catch(error){
        toastr.error("Невірно введенний логін чи пароль!","Не вірні данні")   
       }
   }   

   const formik = useFormik({
       initialValues: initialValues,
       validationSchema: LoginSchema,       
       onSubmit: onHandleSubmit
   })

   const { errors, touched, handleSubmit, handleChange} = formik;

   return (
    
    <div className="row">
        <HomeLayout/>
      <div className="offset-md-3 col-md-6">
        <h1 className="text-center">Вхід</h1>

          <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>              
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Електронна адреса
              </label>
              <input type="email" 
                  className= { classNames("form-control",
                      {"is-invalid": touched.email && errors.email},
                      {"is-valid": touched.email && !errors.email}
                  )}
                  id="email"
                  name="email"
                  onChange={handleChange}
                  />
                  {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input type="password" 
                  className= { classNames("form-control",
                      {"is-invalid": touched.password && errors.password},
                      {"is-valid": touched.password && !errors.password}
                  )}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  />
                  {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
         
            {
              loading?
              <EclipseWidgetContainer/>
              :
              <button type="submit" className="btn btn-primary">
                Увійти
            </button>
            }

          </Form>
        </FormikProvider>
      </div>
    </div>
  );
        
       
}