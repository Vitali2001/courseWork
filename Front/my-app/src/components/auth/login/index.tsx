
import {LoginPage} from "./LoginPage.tsx"
import {React} from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"


export const Login = () =>{
  return(
    <GoogleReCaptchaProvider reCaptchaKey="6Ldq6DoiAAAAACFBIC5trh12V5U9OQ6l24o5RaLC">
      <LoginPage/>
    </GoogleReCaptchaProvider>
  )
}
