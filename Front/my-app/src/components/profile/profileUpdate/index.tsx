import {ProfileUpdate} from "./ProfileUpdate.tsx"
import {React} from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"


 const ProfileChange = () =>{
  return(
    <GoogleReCaptchaProvider reCaptchaKey="6Ldq6DoiAAAAACFBIC5trh12V5U9OQ6l24o5RaLC">
      <ProfileUpdate/>
    </GoogleReCaptchaProvider>
  )
}

export default ProfileChange