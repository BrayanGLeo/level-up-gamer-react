import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/AdminStyle.css';

const AdminSidebar = () => {
    return (
        <aside className="sidebar">
            <h2 className="admin-logo">ADMIN</h2>
            <Nav className="flex-column admin-nav">
                <Nav.Link as={Link} to="/admin">🏠 Inicio</Nav.Link>
                <Nav.Link as={Link} to="/admin/productos">📦 Productos</Nav.Link>
                <Nav.Link as={Link} to="/admin/usuarios">👥 Usuarios</Nav.Link>
                <Nav.Link as={Link} to="/">🌐 Volver a la Tienda</Nav.Link>
            </Nav>
        </aside>
    );
};

export default AdminSidebar;