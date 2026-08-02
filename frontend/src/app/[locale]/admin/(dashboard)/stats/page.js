'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdSave, MdRefresh } from 'react-icons/md';

export default function AdminStatsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/stats');
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/admin/stats/${stats._id}`, stats);
            alert('Stats updated successfully');
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setStats({ ...stats, [field]: parseInt(value) || 0 });
    };

    if (loading) return <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING_METRICS...</div>;

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">STATS MANAGER</h1>
                    <p style={{ color: '#888', marginTop: '0.5rem' }}>Update live event counters and engagement metrics.</p>
                </div>
                <button onClick={loadData} className="admin-login-submit" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#fff' }}>
                    <MdRefresh />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="brutalist-border" style={{ background: '#111', padding: '3rem', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    <div className="admin-login-field">
                        <label className="vt323">PARTICIPANTS COUNT</label>
                        <input 
                            type="number" 
                            value={stats.participants || 0} 
                            onChange={e => handleChange('participants', e.target.value)} 
                        />
                    </div>
                    <div className="admin-login-field">
                        <label className="vt323">TEAMS REGISTERED</label>
                        <input 
                            type="number" 
                            value={stats.teams || 0} 
                            onChange={e => handleChange('teams', e.target.value)} 
                        />
                    </div>
                    <div className="admin-login-field">
                        <label className="vt323">UNIVERSITIES INVOLVED</label>
                        <input 
                            type="number" 
                            value={stats.universities || 0} 
                            onChange={e => handleChange('universities', e.target.value)} 
                        />
                    </div>
                    <div className="admin-login-field">
                        <label className="vt323">TOTAL ATTENDEES</label>
                        <input 
                            type="number" 
                            value={stats.attendees || 0} 
                            onChange={e => handleChange('attendees', e.target.value)} 
                        />
                    </div>
                    <div className="admin-login-field">
                        <label className="vt323">ACTIVE VOLUNTEERS</label>
                        <input 
                            type="number" 
                            value={stats.volunteers || 0} 
                            onChange={e => handleChange('volunteers', e.target.value)} 
                        />
                    </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
                    <button 
                        type="submit" 
                        className="admin-login-submit" 
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <MdSave /> {saving ? 'SAVING_CHANGES...' : 'SAVE_ALL_METRICS'}
                    </button>
                </div>
            </form>

            <div className="vt323" style={{ marginTop: '2rem', color: '#444' }}>
                <p>LAST_SYNCED: {new Date(stats.updatedAt || stats.createdAt).toLocaleString()}</p>
                <p>HEX_DATA_PTR: {stats._id}</p>
            </div>
        </div>
    );
}
