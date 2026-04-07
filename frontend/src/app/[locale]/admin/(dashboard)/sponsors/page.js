'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminSponsorsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({ _id: null });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const raw = await api.get('/sponsors');
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
            setFormData({ _id: item._id });
            setPreviewUrl(item.image?.startsWith('http') ? item.image : `http://127.0.0.1:5000${item.image}`);
        } else {
            setEditMode('add');
            setFormData({ _id: null });
            setPreviewUrl('');
        }
        setImageFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this sponsor logo?')) return;
        try {
            await api.delete(`/admin/sponsors/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            if (imageFile) {
                payload.append('image', imageFile);
            }

            if (editMode === 'add') {
                if (!imageFile) throw new Error("Logo image is required.");
                await api.postForm('/admin/sponsors', payload);
            } else {
                await api.putForm(`/admin/sponsors/${formData._id}`, payload);
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
            await api.post('/admin/sponsors/reorder', { ids });
            setItems(newItems);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">SPONSORS MANAGER</h1>
                </div>
                <div>
                    <button 
                        onClick={() => handleOpenForm()} 
                        className="admin-login-submit" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.5rem 1.5rem', fontSize: '1.25rem' }}
                    >   
                        <MdAdd /> ADD LOGO
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING...</div>
            ) : (
                <div className="admin-nodes-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {items.map((item, index) => (
                        <div key={item._id} className="brutalist-border" style={{ display: 'flex', flexDirection: 'column', background: '#222' }}>
                            <div style={{ height: '150px', width: '100%', backgroundImage: `url(${item.image?.startsWith('http') ? item.image : 'http://127.0.0.1:5000' + item.image})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderBottom: '2px solid #555' }}></div>
                            <div className="vt323" style={{ padding: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => handleReorder(index, -1)} 
                                        style={{ flex: 1, background: 'transparent', border: '1px solid #555', color: index === 0 ? '#333' : '#fff', padding: '0.5rem', cursor: index === 0 ? 'default' : 'pointer' }}
                                    >
                                        ↑
                                    </button>
                                    <button 
                                        disabled={index === items.length - 1}
                                        onClick={() => handleReorder(index, 1)} 
                                        style={{ flex: 1, background: 'transparent', border: '1px solid #555', color: index === items.length - 1 ? '#333' : '#fff', padding: '0.5rem', cursor: index === items.length - 1 ? 'default' : 'pointer' }}
                                    >
                                        ↓
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleOpenForm(item)} style={{ flex: 1, background: 'transparent', border: '1px solid #555', color: '#fff', padding: '0.5rem', cursor: 'pointer' }}>
                                        <MdEdit />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} style={{ flex: 1, background: 'var(--admin-red)', border: '1px solid var(--admin-red)', color: '#000', padding: '0.5rem', cursor: 'pointer' }}>
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="vt323" style={{ color: '#555', fontSize: '1.5rem' }}>NO SPONSOR LOGOS FOUND.</div>
                    )}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="michroma" style={{ fontSize: '1.5rem' }}>{editMode === 'add' ? 'UPLOAD LOGO' : 'EDIT LOGO'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-red)', fontSize: '2rem', cursor: 'pointer' }}>
                                <MdClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            {previewUrl && (
                                <div style={{ width: '100%', height: '150px', backgroundImage: `url(${previewUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', marginBottom: '1.5rem', border: '2px dashed #555' }}></div>
                            )}

                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label className="vt323">Logo Image {editMode === 'edit' && '(Leave blank to keep existing)'}</label>
                                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} />
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
