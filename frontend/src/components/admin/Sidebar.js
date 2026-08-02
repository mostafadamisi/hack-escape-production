'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { MdDashboard, MdPeople, MdPhotoLibrary, MdVideocam, MdCardMembership, MdEvent, MdAnalytics, MdInbox, MdTerminal, MdSecurity } from 'react-icons/md';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: MdDashboard, sysCode: '0x0A1' },
    { name: 'Team', href: '/admin/team', icon: MdPeople, sysCode: '0x0B3' },
    { name: 'Gallery', href: '/admin/gallery', icon: MdPhotoLibrary, sysCode: '0x0C7' },
    { name: 'Media', href: '/admin/media', icon: MdVideocam, sysCode: '0x0D9' },
    { name: 'Sponsors', href: '/admin/sponsors', icon: MdCardMembership, sysCode: '0x0E2' },
    { name: 'Timeline', href: '/admin/timeline', icon: MdEvent, sysCode: '0x0F4' },
    { name: 'Stats', href: '/admin/stats', icon: MdAnalytics, sysCode: '0x101' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MdInbox, sysCode: '0x112' },
    { name: 'System Shell', href: '/admin/terminal', icon: MdTerminal, sysCode: '0x12F' },
    { name: 'Security', href: '/admin/security', icon: MdSecurity, sysCode: '0x13E' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const locale = params?.locale || 'en';

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2 className="michroma" style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>HACK&ESCAPE</h2>
            </div>
            
            <div className="sidebar-nav-container">
                <p className="vt323" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', textDecoration: 'underline', textDecorationColor: 'var(--admin-red)' }}>Available Sectors</p>
                
                <nav>
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname === `/${locale}${item.href}`;
                        const Icon = item.icon;
                        const href = `/${locale}${item.href}`;
                        
                        return (
                            <Link 
                                key={item.name} 
                                href={href}
                                className={`sidebar-nav-item stagger-${(index % 5) + 1} ${isActive ? 'active' : ''}`}
                            >
                                <div className="icon-text vt323">
                                    <Icon />
                                    <span>{item.name}</span>
                                </div>
                                <span className="vt323">{item.sysCode}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
