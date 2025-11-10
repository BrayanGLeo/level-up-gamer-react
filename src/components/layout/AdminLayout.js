import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminStyle.css';
import AdminNotificationModal from '../AdminNotificationModal';

const AdminLayout = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.body.classList.add('admin-body');

        if (!currentUser || currentUser.role !== 'Administrador') {
            setShowModal(true);
        }

        return () => {
            document.body.classList.remove('admin-body');
        };
    }, [currentUser]);

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    };

    if (showModal) {
        return (
            <AdminNotificationModal
                show={showModal}
                onHide={handleModalClose}
                title="Acceso Denegado"
                message="Acceso denegado. Debes ser administrador para ver esta página."
            />
        );
    }

    if (!currentUser || currentUser.role !== 'Administrador') {
        return null;
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