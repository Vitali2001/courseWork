import ChangePass from "./ChangePass.tsx"
import React from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

const ChangePassword = () =>{
    return(  
        <GoogleReCaptchaProvider reCaptchaKey="6Ldq6DoiAAAAACFBIC5trh12V5U9OQ6l24o5RaLC">
      <ChangePass/>
    </GoogleReCaptchaProvider>
    )
}
export default ChangePassword