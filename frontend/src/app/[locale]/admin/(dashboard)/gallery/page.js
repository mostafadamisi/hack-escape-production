'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminGalleryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({
        _id: null,
        title: { en: '', ar: '' },
        category: { en: '', ar: '' }
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const raw = await api.get('/gallery');
            setItems(raw);
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
                category: safeParse(item.category),
            });
            setPreviewUrl(item.image?.startsWith('http') ? item.image : `http://127.0.0.1:5000${item.image}`);
        } else {
            setEditMode('add');
            setFormData({ _id: null, title: { en: '', ar: '' }, category: { en: '', ar: '' } });
            setPreviewUrl('');
        }
        setImageFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;
        try {
            await api.delete(`/admin/gallery/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('title', JSON.stringify(formData.title)); 
            payload.append('category', JSON.stringify(formData.category)); 
            
            if (imageFile) {
                payload.append('image', imageFile);
            }

            if (editMode === 'add') {
                if (!imageFile) throw new Error("Image is required to add a gallery item.");
                await api.postForm('/admin/gallery', payload);
            } else {
                await api.putForm(`/admin/gallery/${formData._id}`, payload);
            }
            setIsEditing(false);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="admin-page-content schematic-bg">
            <div className="admin-page-header-row vt323" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-page-title michroma">GALLERY MANAGER</h1>
                </div>
                <div>
                    <button 
                        onClick={() => handleOpenForm()} 
                        className="admin-login-submit" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.5rem 1.5rem', fontSize: '1.25rem' }}
                    >   
                        <MdAdd /> UPLOAD IMAGE
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--admin-red)', fontSize: '2rem' }} className="vt323 blink">LOADING...</div>
            ) : (
                <div className="admin-nodes-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {items.map(item => (
                        <div key={item._id} className="brutalist-border" style={{ display: 'flex', flexDirection: 'column', background: '#000' }}>
                            <div style={{ height: '200px', width: '100%', backgroundImage: `url(${item.image?.startsWith('http') ? item.image : 'http://127.0.0.1:5000' + item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '2px solid #333' }}></div>
                            <div className="vt323" style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--admin-red)' }}>{typeof item.title === 'object' ? item.title.en : item.title}</h3>
                                <p style={{ fontSize: '1rem', color: '#888', margin: '0 0 1rem 0' }}>{typeof item.category === 'object' ? item.category.en : item.category}</p>
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
                        <div className="vt323" style={{ color: '#555', fontSize: '1.5rem' }}>NO IMAGES FOUND.</div>
                    )}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="michroma" style={{ fontSize: '1.5rem' }}>{editMode === 'add' ? 'UPLOAD IMAGE' : 'EDIT IMAGE'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-red)', fontSize: '2rem', cursor: 'pointer' }}>
                                <MdClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            {previewUrl && (
                                <div style={{ width: '100%', height: '250px', backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '1.5rem', border: '2px solid #555' }}></div>
                            )}

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Image File {editMode === 'edit' && '(Leave blank to keep existing)'}</label>
                                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Image Title (English)</label>
                                <input type="text" required value={formData.title.en} onChange={e => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} />
                            </div>
                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Image Title (Arabic)</label>
                                <input type="text" dir="rtl" required value={formData.title.ar} onChange={e => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })} />
                            </div>

                            <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                <label className="vt323">Image Category (English)</label>
                                <input type="text" required value={formData.category.en} onChange={e => setFormData({ ...formData, category: { ...formData.category, en: e.target.value } })} />
                            </div>
                            <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Image Category (Arabic)</label>
                                <input type="text" dir="rtl" required value={formData.category.ar} onChange={e => setFormData({ ...formData, category: { ...formData.category, ar: e.target.value } })} />
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
