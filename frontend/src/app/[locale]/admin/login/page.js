'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/admin/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <p className="vt323">LOADING...</p>
                    <div style={{ width: '256px', height: '4px', background: '#333', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--admin-red)', width: '50%', position: 'absolute' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-login-layout admin-shell">
            <div className="admin-login-left hidden md:flex">
                <h1 className="admin-login-headline michroma">
                    ADMIN LOGIN
                </h1>
            </div>

            <div className="admin-login-right">
                <div className="admin-login-form-box stagger-5">
                    
                    <div className="admin-login-form-header">
                        <h2 className="michroma">Login</h2>
                        <p className="vt323">Input credentials to access the admin dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-login-field">
                            <label className="vt323">Email</label>
                            <input id="email" type="email" required placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="admin-login-field">
                            <label className="vt323">Password</label>
                            <input id="password" type="password" required placeholder="*********" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {error && (
                            <div className="admin-login-error">
                                !! {error} !!
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="admin-login-submit">
                            Log In
                        </button>
                    </form>

                    <div className="vt323" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-start', color: '#555', fontSize: '1.25rem' }}>
                        <span>Dashboard Access</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
