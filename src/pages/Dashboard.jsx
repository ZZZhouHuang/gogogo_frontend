import React from 'react';
import {Routes, Route, Outlet} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserMenu from '../components/UserMenu';



export default function Dashboard() {

    return (

            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                    <div className="flex justify-end">
                        <UserMenu onLogout={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }} />
                    </div>

                    <div className="mt-4">
                        <Outlet />
                    </div>
                </div>
            </div>

    );
}
