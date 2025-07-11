import React, { useState } from 'react';

export default function UserMenu({ onLogout }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <img
                src="/avatar.png"
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded border z-50">
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={onLogout}
                    >
                        退出登录
                    </button>
                </div>
            )}
        </div>
    );
}
