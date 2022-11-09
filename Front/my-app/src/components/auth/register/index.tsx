
import {RegisterUser} from "./RegisterUser.tsx"
import {React} from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"


 const Register = () =>{
  return(
    <GoogleReCaptchaProvider reCaptchaKey="6Ldq6DoiAAAAACFBIC5trh12V5U9OQ6l24o5RaLC">
      <RegisterUser/>
    </GoogleReCaptchaProvider>
  )
}

export default Register