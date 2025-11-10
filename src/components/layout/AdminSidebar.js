import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminStyle.css';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

    return (
        <aside className="sidebar">
            <h2 className="admin-logo">LEVEL-UP</h2>
            
            <Nav className="flex-column admin-nav">
                <Nav.Link as={Link} to="/admin" active={isActive('/admin') && location.pathname === '/admin'}>
                    🏠 Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/ordenes" active={isActive('/admin/ordenes')}>
                    🛒 Órdenes
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/productos" active={isActive('/admin/productos')}>
                    📦 Productos
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/categorias" active={isActive('/admin/categorias')}>
                    🏷️ Categorías
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/usuarios" active={isActive('/admin/usuarios')}>
                    👥 Usuarios
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/reportes" active={isActive('/admin/reportes')}>
                    📊 Reportes
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/perfil" active={isActive('/admin/perfil')}>
                    👤 Perfil
                </Nav.Link>
            </Nav>
            
            <div className="sidebar-footer">
                <hr />
                <Nav className="flex-column admin-nav">
                    <Nav.Link as={Link} to="/">
                        🌐 Volver a la Tienda
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>
                        🚪 Cerrar Sesión
                    </Nav.Link>
                </Nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;