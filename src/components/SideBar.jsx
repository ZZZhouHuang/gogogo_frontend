import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const linkClass =
        'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition';

    return (
        <div className="w-60 h-screen bg-white shadow-md p-4 pt-24">
            <h2 className="text-xl font-bold mb-4">体育预约系统</h2>
            <nav className="space-y-2">
                <NavLink to="/dashboard/venues" className={linkClass}>
                    活动场馆
                </NavLink>
                <NavLink to="/dashboard/signup" className={linkClass}>
                    活动报名
                </NavLink>
                <NavLink to="/dashboard/my-activities" className={linkClass}>
                    我的活动
                </NavLink>
                <NavLink to="/dashboard/profile" className={linkClass}>
                    个人信息
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
