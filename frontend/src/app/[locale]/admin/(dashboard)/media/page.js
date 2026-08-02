'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminMediaPage() {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({
        _id: null,
        title: { en: '', ar: '' },
        sourceName: '',
        link: '',
        date: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const raw = await api.get('/media');
            setMediaItems(raw);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const safeParse = (val) => {
        if (!val) return { en: '', ar: '' };
        if (typeof val === 'object') return val;
        try {
            const parsed = JSON.parse(val);
            if (typeof parsed === 'object') return parsed;
        } catch(e) {}
        return { en: val, ar: val };
    };

    const handleOpenForm = (item = null) => {
        if (item) {
            setEditMode('edit');
            setFormData({
                _id: item._id,
                title: safeParse(item.title),
                sourceName: item.sourceName || '',
                link: item.link || '',
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : ''
            });
        } else {
            setEditMode('add');
            setFormData({ _id: null, title: { en: '', ar: '' }, sourceName: '', link: '', date: new Date().toISOString().split('T')[0] });
        }
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this media entry?')) return;
        try {
            await api.delete(`/admin/media/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                title: formData.title,
                sourceName: formData.sourceName,
                link: formData.link,
                date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
            };

            if (editMode === 'add') {
                await api.post('/admin/media', dataToSend);
            } else {
                await api.put(`/admin/media/${formData._id}`, dataToSend);
            }
            setIsEditing(false);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const renderText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field.en;
        return field;
    };

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">MEDIA MANAGER</h1>
                </div>
                <div>
                    <button 
                        onClick={() => handleOpenForm()} 
                        className="admin-login-submit" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.5rem 1.5rem', fontSize: '1.25rem' }}
                    >   
                        <MdAdd /> NEW ENTRY
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING...</div>
            ) : (
                <div className="admin-nodes-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {mediaItems.map(item => (
                        <div key={item._id} className="brutalist-border" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
                            <div className="vt323">
                                <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--admin-red)' }}>{renderText(item.title)}</h3>
                                <p style={{ margin: '0.25rem 0', color: '#888', fontSize: '1.25rem' }}>{item.sourceName} | {item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-yellow)', textDecoration: 'underline' }}>{item.link}</a>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleOpenForm(item)} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '0.5rem', cursor: 'pointer' }}>
                                    <MdEdit />
                                </button>
                                <button onClick={() => handleDelete(item._id)} style={{ background: 'var(--admin-red)', border: '1px solid var(--admin-red)', color: '#000', padding: '0.5rem', cursor: 'pointer' }}>
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                    {mediaItems.length === 0 && (
                        <div className="vt323" style={{ color: '#555', fontSize: '1.5rem' }}>NO MEDIA ENTRIES FOUND.</div>
                    )}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="michroma" style={{ fontSize: '1.5rem' }}>{editMode === 'add' ? 'ADD MEDIA' : 'EDIT MEDIA'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-red)', fontSize: '2rem', cursor: 'pointer' }}>
                                <MdClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Headline Title (English)</label>
                                <input type="text" required value={formData.title.en} onChange={e => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} />
                            </div>
                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Headline Title (Arabic)</label>
                                <input type="text" dir="rtl" required value={formData.title.ar} onChange={e => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })} />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Source/Publisher Name (e.g. Jordan Times)</label>
                                <input type="text" required value={formData.sourceName} onChange={e => setFormData({ ...formData, sourceName: e.target.value })} />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Publish Date</label>
                                <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.8rem', fontFamily: 'var(--font-vt323)' }} />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label className="vt323">Article/Video URL</label>
                                <input type="url" required value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                            </div>

                            <button type="submit" className="admin-login-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <MdSave /> SAVE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
