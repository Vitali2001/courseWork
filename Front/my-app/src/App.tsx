
import './App.css';
import HomePage from './components/Home/index.tsx'
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HomeLayout from './containers/Navbar/index.tsx';
import { Login } from './components/auth/login/index.tsx';
import LogOut from './components/auth/logout/index.tsx';
import Register from './components/auth/register/index.tsx';
import Profile from './components/profile/profileInfo/index.tsx';
import ProfileChange from './components/profile/profileUpdate/index.tsx';
import ChangePassword from './components/profile/changePass/index.tsx';
import Orders from './components/profile/orders/index.tsx';
import Drivers from './components/drivers/index.tsx'
import CurrentUser from "./components/curentUser/index.tsx"
import Customers from './components/customers/index.tsx';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"



function App() {
  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey="6Ldq6DoiAAAAACFBIC5trh12V5U9OQ6l24o5RaLC">
      <Routes>
        <Route path="/" element={<HomeLayout/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path = "login" element={<Login/>}/>
        <Route path = "logout" element={<LogOut/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="profileUpdate" element={<ProfileChange/>}/>
        <Route path="changePassword" element={<ChangePassword/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path = "drivers" element={<Drivers/>} />
        <Route path = "current_user" element={<CurrentUser/>}/>
        <Route path = "customers" element={<Customers/>} />
      </Routes>
      </GoogleReCaptchaProvider>
    </>
  );
}

export default App;
