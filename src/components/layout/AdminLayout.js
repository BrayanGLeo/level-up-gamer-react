import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminStyle.css';

const AdminLayout = () => {
    const { currentUser } = useAuth();

    if (!currentUser || currentUser.role !== 'Administrador') {
        alert("Acceso denegado. Debes ser administrador.");
        return <Navigate to="/login" />;
    }

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;