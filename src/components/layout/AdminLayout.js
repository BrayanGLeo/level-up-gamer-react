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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        document.body.classList.add('admin-body');

        if (!currentUser || (currentUser.role !== 'Administrador' && currentUser.role !== 'Vendedor')) {
            setShowModal(true);
        }

        return () => {
            document.body.classList.remove('admin-body');
        };
    }, [currentUser, navigate]);

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

    if (!currentUser || (currentUser.role !== 'Administrador' && currentUser.role !== 'Vendedor')) {
        return null; 
    }

    return (
        <div className={`admin-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            
            <AdminSidebar toggleSidebar={toggleSidebar} />
            
            <main className="admin-main-content">
                
                <button className="admin-hamburger-btn" onClick={toggleSidebar}>
                    &#9776;
                </button>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;