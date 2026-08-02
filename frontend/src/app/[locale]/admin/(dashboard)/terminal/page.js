'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminTerminalPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({
        _id: null,
        text: { en: '', ar: '' },
        type: 'info'
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = await api.get('/terminal');
            if (!Array.isArray(raw)) throw new Error("Expected an array of terminal logs.");
            setItems(raw);
        } catch (err) { 
            console.error(err); 
            setError(err.message);
        }
        finally { setLoading(false); }
    };

    const handleOpenForm = (item = null) => {
        if (item) {
            setEditMode('edit');
            let itemText = item.text;
            if (typeof itemText === 'string') {
                try { itemText = JSON.parse(itemText); } catch(e) { itemText = { en: itemText, ar: '' }; }
            }
            if (!itemText || typeof itemText !== 'object') itemText = { en: '', ar: '' };
            
            setFormData({
                _id: item._id,
                text: { en: itemText.en || '', ar: itemText.ar || '' },
                type: item.type || 'info'
            });
        } else {
            setEditMode('add');
            setFormData({ _id: null, text: { en: '', ar: '' }, type: 'info' });
        }
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this terminal log?')) return;
        try {
            await api.delete(`/admin/terminal/${id}`);
            loadData();
        } catch (err) { alert(err.message); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                text: JSON.stringify(formData.text),
                type: formData.type,
                order: editMode === 'add' ? items.length : items.find(i => i._id === formData._id).order
            };

            if (editMode === 'add') {
                await api.post('/admin/terminal', payload);
            } else {
                await api.put(`/admin/terminal/${formData._id}`, payload);
            }
            setIsEditing(false);
            loadData();
        } catch (err) { alert(err.message); }
    };

    const handleReorder = async (currentIndex, direction) => {
        const newItems = [...items];
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
        try {
            const ids = newItems.map(item => item._id);
            await api.post('/admin/terminal/reorder', { ids });
            setItems(newItems);
        } catch (err) { alert(err.message); }
    }

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">SYSTEM SHELL MANAGER</h1>
                    <p style={{ color: '#888', marginTop: '0.5rem' }}>Configure the real-time status logs for the home page terminal.</p>
                </div>
                <button onClick={() => handleOpenForm()} className="admin-login-submit" style={{ width: 'auto', padding: '0 1.5rem', height: '45px' }}>
                    <MdAdd /> ADD_LOG_ENTRY
                </button>
            </div>

            {error && (
                <div className="brutalist-border vt323" style={{ background: 'var(--admin-red)', color: '#000', padding: '1rem', marginBottom: '2rem' }}>
                    ERROR_DETECTED: {error}
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING_BINARY...</div>
            ) : (
                <div className="admin-nodes-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {items.map((item, index) => (
                        <div key={item._id} className="brutalist-border" style={{ display: 'flex', background: '#050505', padding: '1rem 1.5rem', gap: '1.5rem', alignItems: 'center' }}>
                            <div className="vt323" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <button disabled={index === 0} onClick={() => handleReorder(index, -1)} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', padding: '2px 8px' }}>↑</button>
                                <button disabled={index === items.length - 1} onClick={() => handleReorder(index, 1)} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', padding: '2px 8px' }}>↓</button>
                            </div>
                            
                            <div style={{ flex: 1, fontFamily: 'monospace', color: item.type === 'warning' ? 'var(--admin-red)' : item.type === 'success' ? '#27c93f' : '#aaa' }}>
                                <span style={{ color: '#444' }}>[{index.toString().padStart(2, '0')}]</span> {
                                    typeof item.text === 'object' 
                                        ? (item.text.en || 'EMPTY_LOG') 
                                        : (item.text || 'EMPTY_LOG')
                                }
                            </div>

                            <div className="vt323" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenForm(item)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
                                    EDIT
                                </button>
                                <button onClick={() => handleDelete(item._id)} style={{ background: 'var(--admin-red)', border: 'none', color: '#000', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
                                    DEL
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2.5rem', width: '90%', maxWidth: '700px' }}>
                        <h2 className="michroma" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{editMode === 'add' ? 'INITIALIZE_LOG_ENTRY' : 'UPDATE_LOG_ENTRY'}</h2>
                        
                        <form onSubmit={handleSubmit} className="vt323">
                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label>LOG_CONTENT (ENGLISH)</label>
                                <input type="text" value={formData.text.en} onChange={e => setFormData({...formData, text: {...formData.text, en: e.target.value}})} required />
                            </div>
                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label>LOG_CONTENT (ARABIC)</label>
                                <input type="text" value={formData.text.ar} onChange={e => setFormData({...formData, text: {...formData.text, ar: e.target.value}})} dir="rtl" required />
                            </div>
                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label>LOG_TYPE / SIGNAL_COLOR</label>
                                <select 
                                    value={formData.type} 
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    style={{ width: '100%', background: '#111', border: '1px solid #444', color: '#fff', padding: '0.8rem' }}
                                >
                                    <option value="info">INFO (GRAY)</option>
                                    <option value="success">SUCCESS (GREEN)</option>
                                    <option value="warning">WARNING (RED)</option>
                                    <option value="process">PROCESS (CYAN)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="admin-login-submit" style={{ flex: 1 }}>SAVE_MODIFICATIONS</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="admin-login-submit" style={{ flex: 1, background: 'transparent', border: '1px solid #444' }}>ABORT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
