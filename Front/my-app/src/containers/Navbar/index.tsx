import * as React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './Navbar.tsx';

const HomeLayout : React.FC = () => {
    return (
        <>
            <Navbar/>
            <main>
                <div className="container">
                    <Outlet/>
                </div>
            </main>
        </>
    )
}

export default HomeLayout;