'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from 'react-icons/md';

export default function AdminTeamPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState('add');
    
    const [formData, setFormData] = useState({
        _id: null,
        name: { en: '', ar: '' },
        role: { en: '', ar: '' },
        bio: { en: '', ar: '' },
        position: { en: '', ar: '' },
        linkedin: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const raw = await api.get('/team');
            setMembers(raw);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (member = null) => {
        if (member) {
            setEditMode('edit');
            setFormData({
                _id: member._id,
                name: typeof member.name === 'object' ? member.name : { en: member.name, ar: member.name },
                role: typeof member.role === 'object' ? member.role : { en: member.role, ar: member.role },
                bio: typeof member.bio === 'object' ? member.bio : { en: member.bio, ar: member.bio },
                position: typeof member.position === 'object' ? member.position : { en: member.position, ar: member.position },
                linkedin: member.linkedin || ''
            });
            setPreviewUrl(member.image?.startsWith('http') ? member.image : `http://127.0.0.1:5000${member.image}`);
        } else {
            setEditMode('add');
            setFormData({ 
                _id: null, 
                name: { en: '', ar: '' }, 
                role: { en: '', ar: '' }, 
                bio: { en: '', ar: '' }, 
                position: { en: '', ar: '' }, 
                linkedin: '' 
            });
            setPreviewUrl('');
        }
        setImageFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            await api.delete(`/admin/team/${id}`);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append('name', JSON.stringify(formData.name));
            payload.append('role', JSON.stringify(formData.role));
            payload.append('bio', JSON.stringify(formData.bio));
            payload.append('position', JSON.stringify(formData.position));
            payload.append('linkedin', formData.linkedin || '');
            
            if (imageFile) {
                payload.append('image', imageFile);
            }

            if (editMode === 'add') {
                await api.postForm('/admin/team', payload);
            } else {
                await api.putForm(`/admin/team/${formData._id}`, payload);
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
                    <h1 className="admin-page-title michroma">TEAM MANAGER</h1>
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
                    
                    {members.map(item => (
                        <div key={item._id} className="brutalist-border" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', backgroundImage: `url(${item.image?.startsWith('http') ? item.image : 'http://127.0.0.1:5000' + item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', border: '1px solid #333' }}></div>
                                <div className="vt323">
                                    <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--admin-red)' }}>{renderText(item.name)}</h3>
                                    <p style={{ margin: '0.25rem 0 0 0', color: '#fff', fontSize: '1.25rem' }}>{renderText(item.role)}</p>
                                    <p style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '1.25rem' }}>{renderText(item.position)}</p>
                                </div>
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
                    
                    {members.length === 0 && (
                        <div className="vt323" style={{ color: '#555', fontSize: '1.5rem' }}>NO TEAM MEMBERS FOUND.</div>
                    )}
                </div>
            )}

            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="brutalist-border" style={{ background: '#000', padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="michroma" style={{ fontSize: '1.5rem' }}>{editMode === 'add' ? 'ADD MEMBER' : 'EDIT MEMBER'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-red)', fontSize: '2rem', cursor: 'pointer' }}>
                                <MdClose />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                {previewUrl && (
                                    <div style={{ width: '100px', height: '100px', backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '1rem', border: '2px solid #555' }}></div>
                                )}
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323">Profile Image</label>
                                    <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }} />
                                </div>

                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323">Name (English)</label>
                                    <input type="text" required value={formData.name.en || ''} onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} />
                                </div>
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Name (Arabic)</label>
                                    <input type="text" dir="rtl" required value={formData.name.ar || ''} onChange={e => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })} />
                                </div>

                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323">Role (English) [e.g. Main Organizer]</label>
                                    <input type="text" value={formData.role.en || ''} onChange={e => setFormData({ ...formData, role: { ...formData.role, en: e.target.value } })} />
                                </div>
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Role (Arabic)</label>
                                    <input type="text" dir="rtl" value={formData.role.ar || ''} onChange={e => setFormData({ ...formData, role: { ...formData.role, ar: e.target.value } })} />
                                </div>
                            </div>
                            
                            <div>
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323">Position (English) [e.g. Hacker]</label>
                                    <input type="text" value={formData.position.en || ''} onChange={e => setFormData({ ...formData, position: { ...formData.position, en: e.target.value } })} />
                                </div>
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Position (Arabic)</label>
                                    <input type="text" dir="rtl" value={formData.position.ar || ''} onChange={e => setFormData({ ...formData, position: { ...formData.position, ar: e.target.value } })} />
                                </div>

                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323">Bio (English)</label>
                                    <textarea required style={{ width: '100%', height: '80px', background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.5rem', fontFamily: 'var(--font-vt323)' }} value={formData.bio.en || ''} onChange={e => setFormData({ ...formData, bio: { ...formData.bio, en: e.target.value } })}></textarea>
                                </div>
                                <div className="admin-login-field" style={{ marginBottom: '1.5rem' }}>
                                    <label className="vt323" style={{ direction: 'rtl', display: 'block', textAlign: 'left' }}>Bio (Arabic)</label>
                                    <textarea dir="rtl" required style={{ width: '100%', height: '80px', background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.5rem', fontFamily: 'var(--font-vt323)' }} value={formData.bio.ar || ''} onChange={e => setFormData({ ...formData, bio: { ...formData.bio, ar: e.target.value } })}></textarea>
                                </div>

                                <div className="admin-login-field" style={{ marginBottom: '2rem' }}>
                                    <label className="vt323">LinkedIn URL</label>
                                    <input type="url" value={formData.linkedin || ''} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="admin-login-submit" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '50%', margin: '0 auto' }}>
                                <MdSave /> SAVE
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
