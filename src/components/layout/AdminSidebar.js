import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminStyle.css';

const AdminSidebar = ({ toggleSidebar }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

    const handleLinkClick = () => {
        if (window.innerWidth <= 767) {
            toggleSidebar();
        }
    };

    return (
        <aside className="sidebar">
            <button className="admin-sidebar-close" onClick={toggleSidebar}>
                &times;
            </button>
            
            <h2 className="admin-logo">LEVEL-UP</h2>
            
            <Nav className="flex-column admin-nav">
                
                
                {currentUser && currentUser.role === 'Administrador' && (
                    <>
                        <Nav.Link as={Link} to="/admin" active={isActive('/admin') && location.pathname === '/admin'} onClick={handleLinkClick}>
                            🏠 Dashboard
                        </Nav.Link>
                    </>
                )}
                
                <Nav.Link as={Link} to="/admin/ordenes" active={isActive('/admin/ordenes')} onClick={handleLinkClick}>
                    🛒 Órdenes
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/productos" active={isActive('/admin/productos')} onClick={handleLinkClick}>
                    📦 Productos
                </Nav.Link>

                {currentUser && currentUser.role === 'Administrador' && (
                    <>
                        <Nav.Link as={Link} to="/admin/categorias" active={isActive('/admin/categorias')} onClick={handleLinkClick}>
                            🏷️ Categorías
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/usuarios" active={isActive('/admin/usuarios')} onClick={handleLinkClick}>
                            👥 Usuarios
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/reportes" active={isActive('/admin/reportes')} onClick={handleLinkClick}>
                            📊 Reportes
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/perfil" active={isActive('/admin/perfil')} onClick={handleLinkClick}>
                            👤 Perfil
                        </Nav.Link>
                    </>
                )}
            </Nav>
            
            <div className="sidebar-footer">
                <hr />
                <Nav className="flex-column admin-nav">
                    <Nav.Link as={Link} to="/" onClick={handleLinkClick}>
                        🌐 Volver a la Tienda
                    </Nav.Link>
                    <Nav.Link onClick={() => {
                        handleLogout();
                        handleLinkClick();
                    }}>
                        🚪 Cerrar Sesión
                    </Nav.Link>
                </Nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;