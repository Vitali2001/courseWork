import * as React from 'react';
import {Outlet} from 'react-router-dom';
import UserPanel from './UserPanel.tsx';

const UserNavbar : React.FC = () => {
    return (
        <>
            <UserPanel/>
            <main>
                <div className="container">
                    <Outlet/>
                </div>
            </main>
        </>
    )
}

export default UserNavbar;