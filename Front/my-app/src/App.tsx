
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



function App() {
  return (
    <>

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
      </Routes>
    </>
  );
}

export default App;
