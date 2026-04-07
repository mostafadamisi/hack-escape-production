'use client';

import React from 'react';
import { useAuth } from '@/components/admin/AuthContext';
import { MdLogout } from 'react-icons/md';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="admin-header schematic-bg">
            <div className="header-left">
            </div>
            
            <div className="header-right">
                <div className="header-user-info vt323" style={{ border: 'none', paddingLeft: 0 }}>
                    <p style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>{user?.name || "Admin"}</p>
                </div>
                
                <button onClick={logout} className="header-logout-btn">
                    <MdLogout />
                    LOG OUT
                </button>
            </div>
        </header>
    );
}
