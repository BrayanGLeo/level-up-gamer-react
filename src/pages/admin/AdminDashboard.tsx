import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/AdminStyle.css';
import { getProducts } from '../../data/productData';
import { getUsers, Order } from '../../data/userData';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const allProducts = getProducts();
    const allUsers = getUsers();

    const allOrders: Order[] = allUsers.flatMap(user => user.orders || []);

    const totalSales = allOrders.reduce((sum, order) => sum + order.total, 0);
    const purchaseCount = allOrders.length;
    const productCount = allProducts.length;
    const userCount = allUsers.length;


    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resumen de las actividades diarias</p>
                </div>
            </div>

            <Row className="admin-stats-grid">
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-compras">
                        <span className="stats-card-icon">🛒</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Ventas Totales</span>
                            <span className="stats-card-value">${totalSales.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-productos">
                        <span className="stats-card-icon">📦</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Productos</span>
                            <span className="stats-card-value">{productCount}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-usuarios">
                        <span className="stats-card-icon">👥</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Usuarios</span>
                            <span className="stats-card-value">{userCount}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-ordenes">
                        <span className="stats-card-icon">🧾</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Órdenes</span>
                            <span className="stats-card-value">{purchaseCount}</span>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="admin-nav-grid">
                <Link to="/admin" className="admin-nav-card">
                    <div className="nav-card-icon">🏠</div>
                    <h5 className="nav-card-title">Dashboard</h5>
                    <p className="nav-card-text">Visión general de todas las métricas y estadísticas.</p>
                </Link>
                <Link to="/admin/ordenes" className="admin-nav-card">
                    <div className="nav-card-icon">🛒</div>
                    <h5 className="nav-card-title">Órdenes</h5>
                    <p className="nav-card-text">Gestión y seguimiento de todas las órdenes de compra.</p>
                </Link>
                <Link to="/admin/productos" className="admin-nav-card">
                    <div className="nav-card-icon">📦</div>
                    <h5 className="nav-card-title">Productos</h5>
                    <p className="nav-card-text">Administrar inventario y detalles de los productos.</p>
                </Link>
                <Link to="/admin/categorias" className="admin-nav-card">
                    <div className="nav-card-icon">🏷️</div>
                    <h5 className="nav-card-title">Categorías</h5>
                    <p className="nav-card-text">Organizar productos en categorías para facilitar su navegación.</p>
                </Link>
                <Link to="/admin/usuarios" className="admin-nav-card">
                    <div className="nav-card-icon">👥</div>
                    <h5 className="nav-card-title">Usuarios</h5>
                    <p className="nav-card-text">Gestión de cuentas de usuario y sus roles del sistema.</p>
                </Link>
                <Link to="/admin/reportes" className="admin-nav-card">
                    <div className="nav-card-icon">📊</div>
                    <h5 className="nav-card-title">Reportes</h5>
                    <p className="nav-card-text">Generación de informes detallados sobre las operaciones.</p>
                </Link>
                <Link to="/admin/perfil" className="admin-nav-card">
                    <div className="nav-card-icon">👤</div>
                    <h5 className="nav-card-title">Perfil</h5>
                    <p className="nav-card-text">Administración de la información personal y configuraciones.</p>
                </Link>
                <Link to="/" className="admin-nav-card">
                    <div className="nav-card-icon">🌐</div>
                    <h5 className="nav-card-title">Tienda</h5>
                    <p className="nav-card-text">Visualizar la tienda en tiempo real y ver los reportes de usuario.</p>
                </Link>
            </div>
        </>
    );
};

export default AdminDashboard;