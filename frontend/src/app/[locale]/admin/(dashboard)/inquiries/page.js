'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdDelete, MdEmail, MdPhone, MdBusiness, MdPerson, MdAccessTime, MdInfo } from 'react-icons/md';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/inquiries');
            setInquiries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this submission record?')) return;
        try {
            await api.delete(`/admin/inquiries/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const getTypeBadge = (type) => {
        const styles = {
            sponsor: { background: 'var(--admin-yellow)', color: '#000' },
            team: { background: 'var(--admin-red)', color: '#fff' },
            contact: { background: '#444', color: '#fff' }
        };
        const style = styles[type] || styles.contact;
        return (
            <span className="vt323" style={{ ...style, padding: '2px 8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {type?.toUpperCase() || 'UNKNOWN'}
            </span>
        );
    };

    if (loading) return <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">SCANNING_INBOX...</div>;

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">INQUIRIES MANIFEST</h1>
                    <p style={{ color: '#888', marginTop: '0.5rem' }}>Review all received contact and sponsorship signals.</p>
                </div>
            </div>

            <div className="admin-nodes-grid" style={{ gridTemplateColumns: '1fr' }}>
                {inquiries.map((inquiry, index) => (
                    <div key={inquiry._id} className="brutalist-border" style={{ background: '#111', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                {getTypeBadge(inquiry.type)}
                                <div className="vt323" style={{ color: '#555', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MdAccessTime /> {new Date(inquiry.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <button onClick={() => handleDelete(inquiry._id)} style={{ background: 'transparent', border: '1px solid var(--admin-red)', color: 'var(--admin-red)', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MdDelete /> DELETE_RECORD
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="vt323" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff' }}>
                                    <MdPerson style={{ color: 'var(--admin-red)' }} /> 
                                    <span style={{ fontSize: '1.2rem' }}>{inquiry.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#888' }}>
                                    <MdEmail style={{ color: 'var(--admin-red)' }} /> 
                                    <span>{inquiry.email}</span>
                                </div>
                                {inquiry.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#888' }}>
                                        <MdPhone style={{ color: 'var(--admin-red)' }} /> 
                                        <span>{inquiry.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="vt323" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {inquiry.companyName && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff' }}>
                                        <MdBusiness style={{ color: 'var(--admin-red)' }} /> 
                                        <span>{inquiry.companyName} {inquiry.tierInterest ? `(${inquiry.tierInterest.toUpperCase()} TIER)` : ''}</span>
                                    </div>
                                )}
                                {(inquiry.teamName || (inquiry.details && inquiry.details.teamName)) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff' }}>
                                        <MdInfo style={{ color: 'var(--admin-red)' }} /> 
                                        <span>Team: {inquiry.teamName || inquiry.details.teamName} @ {inquiry.university || inquiry.details.university}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="brutalist-border" style={{ background: '#050505', padding: '1.5rem', marginTop: '0.5rem' }}>
                            <p className="vt323" style={{ color: '#aaa', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                {inquiry.message || 'NO_MESSAGE_CONTENT'}
                            </p>
                        </div>
                    </div>
                ))}

                {inquiries.length === 0 && (
                    <div className="vt323" style={{ color: '#555', fontSize: '1.5rem', padding: '4rem', textAlign: 'center' }}>
                        NO_SIGNALS_DETECTED_IN_MANIFEST.
                    </div>
                )}
            </div>
        </div>
    );
}
