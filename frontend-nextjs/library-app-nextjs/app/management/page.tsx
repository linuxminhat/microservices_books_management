'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUser } from '@/lib/localAuth';
import { useEffect, useState } from 'react';
import UserModel from '@/models/UserModel';
import { SpinnerLoading } from '@/components/Utils/SpinnerLoading';
import { API_CONFIG } from '@/config/apiConfig';

export default function ManagementPage() {
    const { user } = useUser();
    const [users, setUsers] = useState<UserModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFullName, setEditFullName] = useState('');
    const [editRole, setEditRole] = useState<'USER' | 'ADMIN'>('USER');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const getAccessToken = async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return '';
        const data = await res.json();
        return data.accessToken || data.idToken || '';
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                setHttpError(null);
                
                if (!user) {
                    setIsLoading(false);
                    setHttpError("You must be signed in as admin to access this page.");
                    return;
                }

                const token = await getAccessToken();
                const url = `${API_CONFIG.AUTH_SERVICE}/admin/users`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                setUsers(data);
            } catch (error: any) {
                setHttpError(error.message || 'Unknown error!');
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    const handleEdit = (user: UserModel) => {
        setEditingId(user.id);
        setEditFullName(user.fullName);
        setEditRole(user.role);
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFullName('');
        setEditRole('USER');
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const handleSave = async (userId: number) => {
        try {
            if (!user) {
                setSubmitError("You must be signed in as admin!");
                return;
            }

            if (!editFullName.trim()) {
                setSubmitError("Full name cannot be empty!");
                return;
            }

            const token = await getAccessToken();
            const url = `${API_CONFIG.AUTH_SERVICE}/admin/users/${userId}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: editFullName.trim(),
                    role: editRole,
                    enabled: users.find(u => u.id === userId)?.enabled ?? true,
                    locked: !(users.find(u => u.id === userId)?.accountNonLocked ?? true),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update user: ${response.status} - ${errorText}`);
            }

            setSubmitSuccess(true);
            setSubmitError(null);
        
            setUsers(users.map(u => 
                u.id === userId 
                    ? { ...u, fullName: editFullName.trim(), role: editRole }
                    : u
            ));
            
            setEditingId(null);
            
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error: any) {
            setSubmitError(error.message);
            setSubmitSuccess(false);
            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <SpinnerLoading />
                </div>
                <Footer />
            </div>
        );
    }

    if (httpError) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="flex-grow-1">
                    <div className="container m-5">
                        <div className="alert alert-danger">{httpError}</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <div className="container mt-5 mb-5">
                    <h3>User Management</h3>
                    
                    {submitSuccess && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>Success!</strong> User updated successfully.
                            <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
                        </div>
                    )}
                    
                    {submitError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> {submitError}
                            <button type="button" className="btn-close" onClick={() => setSubmitError(null)}></button>
                        </div>
                    )}

                    <div className="table-responsive mt-4">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Full Name</th>
                                    <th>Role</th>
                                    <th>Enabled</th>
                                    <th>Account Non-Locked</th>
                                    <th>Account Non-Expired</th>
                                    <th>Credentials Non-Expired</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((userItem) => (
                                    <tr key={userItem.id}>
                                        <td>{userItem.id}</td>
                                        <td>{userItem.email}</td>
                                        <td>
                                            {editingId === userItem.id ? (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={editFullName}
                                                    onChange={(e) => setEditFullName(e.target.value)}
                                                />
                                            ) : (
                                                userItem.fullName
                                            )}
                                        </td>
                                        <td>
                                            {editingId === userItem.id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value as 'USER' | 'ADMIN')}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            ) : (
                                                <span className={`badge ${userItem.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                                    {userItem.role}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${userItem.enabled ? 'bg-success' : 'bg-secondary'}`}>
                                                {userItem.enabled ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${userItem.accountNonLocked ? 'bg-success' : 'bg-secondary'}`}>
                                                {userItem.accountNonLocked ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${userItem.accountNonExpired ? 'bg-success' : 'bg-secondary'}`}>
                                                {userItem.accountNonExpired ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${userItem.credentialsNonExpired ? 'bg-success' : 'bg-secondary'}`}>
                                                {userItem.credentialsNonExpired ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            {editingId === userItem.id ? (
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleSave(userItem.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleEdit(userItem)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="alert alert-info mt-4">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

