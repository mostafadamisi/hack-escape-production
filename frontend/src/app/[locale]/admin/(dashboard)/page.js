'use client';

import React from 'react';
import { useAuth } from '@/components/admin/AuthContext';
import { MdPeople, MdPhotoLibrary, MdVideocam, MdCardMembership, MdArrowForward, MdEvent, MdAnalytics, MdInbox, MdTerminal } from 'react-icons/md';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.5rem' }}>
                <span>Loading...</span>
            </div>
        );
    }

    const managementNodes = [
        { name: 'Team', icon: MdPeople, desc: 'Manage jury members and competition participants.', path: 'team', id: 'NODE-01' },
        { name: 'Gallery', icon: MdPhotoLibrary, desc: 'Curate event photography and visual archives.', path: 'gallery', id: 'NODE-02' },
        { name: 'Media', icon: MdVideocam, desc: 'Administer video content and external highlights.', path: 'media', id: 'NODE-03' },
        { name: 'Sponsors', icon: MdCardMembership, desc: 'Manage partner organizations and sponsorship tiers.', path: 'sponsors', id: 'NODE-04' },
        { name: 'Timeline', icon: MdEvent, desc: 'Update the project roadmap and historical milestones.', path: 'timeline', id: 'NODE-05' },
        { name: 'Stats', icon: MdAnalytics, desc: 'Monitor and adjust live event metrics and participant counts.', path: 'stats', id: 'NODE-06' },
        { name: 'Inquiries', icon: MdInbox, desc: 'Review sponsorship requests and user contact submissions.', path: 'inquiries', id: 'NODE-07' },
        { name: 'System Shell', icon: MdTerminal, desc: 'Configure the real-time terminal logs displayed on the landing page.', path: 'terminal', id: 'NODE-08' },
    ];

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323">
                <div>
                    <h1 className="admin-page-title michroma">
                        DASHBOARD
                    </h1>
                </div>
            </div>
            
            <div className="admin-nodes-grid">
                {managementNodes.map((node, index) => (
                    <Link 
                        key={node.name} 
                        href={`/en/admin/${node.path}`}
                        className={`brutalist-border admin-node-card stagger-${index + 1}`}
                    >
                        <div>
                            <div className="admin-node-header">
                                <div className="admin-node-icon"><node.icon /></div>
                                <h3 className="admin-node-title vt323">{node.name.toUpperCase()}</h3>
                            </div>
                            <p className="admin-node-desc vt323">{node.desc}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                            <span className="vt323" style={{ color: 'var(--admin-yellow)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                ACCESS MODULE
                            </span>
                            <div style={{ width: '40px', height: '40px', border: '2px solid var(--admin-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-red)', fontSize: '1.5rem' }}>
                                <MdArrowForward />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
