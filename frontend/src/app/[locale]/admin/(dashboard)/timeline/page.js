'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminTimelinePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({
        _id: null,
        title: { en: '', ar: '' },
        description: { en: '', ar: '' },
        date: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const raw = await api.get('/timeline');
            setItems(raw);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (item = null) => {
        if (item) {
            setEditMode('edit');
            setFormData({
                _id: item._id,
                title: typeof item.title === 'string' ? { en: item.title, ar: '' } : { ...item.title },
                description: typeof item.description === 'string' ? { en: item.description, ar: '' } : { ...item.description },
                date: item.date || ''
            });
        } else {
            setEditMode('add');
            setFormData({
                _id: null,
                title: { en: '', ar: '' },
                description: { en: '', ar: '' },
                date: ''
            });
        }
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this roadmap milestone?')) return;
        try {
            await api.delete(`/admin/timeline/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: JSON.stringify(formData.title),
                description: JSON.stringify(formData.description),
                date: formData.date
            };

            if (editMode === 'add') {
                await api.post('/admin/timeline', payload);
            } else {
                await api.put(`/admin/timeline/${formData._id}`, payload);
            }
            setIsEditing(false);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleReorder = async (currentIndex, direction) => {
        const newItems = [...items];
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        
        [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
        
        try {
            const ids = newItems.map(item => item._id);
            await api.post('/admin/timeline/reorder', { ids });
            setItems(newItems);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">TIMELINE MANAGER</h1>
                </div>
                <div>
                    <button 
                        onClick={() => handleOpenForm()} 
                        className="admin-login-submit" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '100px 1.5rem', height: '10px' }}
                    >   
                        <MdAdd /> ADD MILESTONE
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING...</div>
            ) : (
                <div className="admin-nodes-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {items.map((item, index) => (
                        <div key={item._id} className="brutalist-border" style={{ display: 'flex', background: '#111', padding: '1.5rem', gap: '2rem', alignItems: 'center' }}>
                            <div className="vt323" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '50px' }}>
                                <button disabled={index === 0} onClick={() => handleReorder(index, -1)} style={{ background: 'transparent', border: '1px solid #555', color: index === 0 ? '#333' : '#fff', cursor: index === 0 ? 'default' : 'pointer' }}>↑</button>
                                <button disabled={index === items.length - 1} onClick={() => handleReorder(index, 1)} style={{ background: 'transparent', border: '1px solid #555', color: index === items.length - 1 ? '#333' : '#fff', cursor: index === items.length - 1 ? 'default' : 'pointer' }}>↓</button>
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--admin-red)', fontSize: '1.2rem' }} className="vt323">{item.date}</span>
                                </div>
                                <h3 className="michroma" style={{ fontSize: '1.1rem', color: '#fff' }}>{typeof item.title === 'object' ? item.title.en : item.title}</h3>
                                <p className="vt323" style={{ color: '#888', marginTop: '0.5rem' }}>{typeof item.description === 'object' ? item.description.en : item.description}</p>
                            </div>

                            <div className="vt323" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenForm(item)} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                                    <MdEdit /> EDIT
                                </button>
                                <button onClick={() => handleDelete(item._id)} style={{ background: 'var(--admin-red)', border: '1px solid var(--admin-red)', color: '#000', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                                    <MdDelete /> DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="vt323" style={{ color: '#555', fontSize: '1.5rem' }}>NO MILESTONES FOUND.</div>
                    )}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="michroma" style={{ fontSize: '1.5rem' }}>{editMode === 'add' ? 'ADD MILESTONE' : 'EDIT MILESTONE'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-red)', fontSize: '2rem', cursor: 'pointer' }}>
                                <MdClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="vt323">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                                <div className="admin-login-field">
                                    <label>TITLE (ENGLISH)</label>
                                    <input type="text" value={formData.title.en} onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})} required />
                                </div>
                                <div className="admin-login-field">
                                    <label>TITLE (ARABIC)</label>
                                    <input type="text" value={formData.title.ar} onChange={e => setFormData({...formData, title: {...formData.title, ar: e.target.value}})} dir="rtl" required />
                                </div>
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label>DATE LABEL (e.g., JAN 2026)</label>
                                <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label>DESCRIPTION (ENGLISH)</label>
                                <textarea 
                                    value={formData.description.en} 
                                    onChange={e => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                                    style={{ width: '100%', background: '#111', border: '1px solid #444', color: '#fff', padding: '1rem', minHeight: '100px' }}
                                />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label>DESCRIPTION (ARABIC)</label>
                                <textarea 
                                    value={formData.description.ar} 
                                    onChange={e => setFormData({...formData, description: {...formData.description, ar: e.target.value}})}
                                    dir="rtl"
                                    style={{ width: '100%', background: '#111', border: '1px solid #444', color: '#fff', padding: '1rem', minHeight: '100px' }}
                                />
                            </div>

                            <button type="submit" className="admin-login-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <MdSave /> SAVE MILESTONE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
