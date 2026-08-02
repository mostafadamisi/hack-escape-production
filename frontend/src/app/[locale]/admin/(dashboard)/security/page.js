'use client';

import { useState } from 'react';
import { api } from '../../../../../lib/api';
import { MdSecurity, MdSave, MdLock, MdShield } from 'react-icons/md';

export default function AdminSecurityPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'ERROR: PASSWORDS_DO_NOT_MATCH' });
            return;
        }

        if (formData.newPassword.length < 8) {
            setStatus({ type: 'error', message: 'ERROR: KEY_LENGTH_MIN_8_REQUIRED' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setStatus({ type: 'success', message: 'ENCRYPTION_KEY_ROTATED_SUCCESSFULLY' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: err.message || 'CREDENTIAL_UPDATE_FAILED' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-content schematic-bg stagger-1">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="admin-page-title michroma"><MdSecurity /> SECURITY_PROTOCOLS</h1>
                    <p style={{ color: '#888', marginTop: '0.5rem' }}>Management of administrative access keys and encryption rotation.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="vt323" style={{ textAlign: 'right', opacity: 0.6 }}>
                        <p>STATUS: <span style={{ color: '#27c93f' }}>SECURE</span></p>
                        <p>ENCRYPTION: BCRYPT_10</p>
                    </div>
                    <div style={{ padding: '10px', border: '1px solid #27c93f', borderRadius: '50%', color: '#27c93f' }}>
                        <MdShield size={24} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div className="brutalist-border" style={{ background: '#050505', padding: '2.5rem' }}>
                    <div className="vt323" style={{ marginBottom: '2rem', borderLeft: '3px solid var(--admin-red)', paddingLeft: '1.5rem' }}>
                        <p style={{ color: 'var(--admin-red)', fontSize: '1.2rem', fontWeight: 'bold' }}>!!_AUTHORIZATION_REQUIRED_!!</p>
                        <p style={{ color: '#666', maxWidth: '400px' }}>To rotate the administrative access key, you must provide the current active signature. Choose a complex, non-sequential key for maximum protection.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="vt323">
                        <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                            <label>CURRENT_ACCESS_KEY</label>
                            <div style={{ position: 'relative' }}>
                                <MdLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-red)', opacity: 0.5 }} />
                                <input 
                                    type="password"
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="admin-login-field">
                                <label>NEW_ACCESS_KEY</label>
                                <input 
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="NEW_SECURE_PHRASE"
                                />
                            </div>
                            <div className="admin-login-field">
                                <label>CONFIRM_NEW_KEY</label>
                                <input 
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="MATCH_PHRASE"
                                />
                            </div>
                        </div>

                        {status && (
                            <div style={{ 
                                padding: '1rem', 
                                background: status.type === 'error' ? 'rgba(188, 10, 16, 0.05)' : 'rgba(39,201,63,0.05)',
                                border: `1px solid ${status.type === 'error' ? 'var(--admin-red)' : '#27c93f'}`,
                                color: status.type === 'error' ? 'var(--admin-red)' : '#27c93f',
                                marginBottom: '2rem',
                                fontSize: '1.1rem'
                            }}>
                                {status.type === 'error' ? '>> FAILURE: ' : '>> SUCCESS: '} {status.message}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="admin-login-submit" 
                            disabled={loading}
                        >
                            {loading ? 'EXECUTING_ROTATION...' : <><MdSave /> COMMIT_SECURITY_UPGRADE</>}
                        </button>
                    </form>
                </div>

                <div className="vt323" style={{ opacity: 0.4 }}>
                    <div className="brutalist-border" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(188, 10, 16, 0.02)' }}>
                        <p style={{ color: 'var(--admin-red)', fontWeight: 'bold' }}>[ACCESS_POLICIES]</p>
                        <ul style={{ listStyle: 'none', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>- MIN_LENGTH: 08_CHARS</li>
                            <li>- BRUTE_FORCE_LOCKOUT: ACTIVE</li>
                            <li>- ATTEMPT_LIMIT: 05_UNITS</li>
                            <li>- COOLDOWN_PERIOD: 15_MINUTES</li>
                        </ul>
                    </div>

                    <div className="brutalist-border" style={{ padding: '1.5rem', fontSize: '0.8rem' }}>
                        <p>[LIVE_TELEMETRY]</p>
                        <div style={{ marginTop: '1rem' }}>
                            <p>CID: #JCC-ADMIN-2026</p>
                            <p>NOD: JORDAN_MAIN_HUB</p>
                            <p>PRT: HTTPS/WSS_SECURE</p>
                            <p style={{ marginTop: '0.5rem' }}>LOGGING_MODE: VERBOSE_ENCRYPTED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
