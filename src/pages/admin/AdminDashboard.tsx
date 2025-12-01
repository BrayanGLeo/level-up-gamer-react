import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/AdminStyle.css';
import { getProductsApi, fetchApi } from '../../utils/api';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ sales: 0, products: 0, users: 0, orders: 0 });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [products, users, orders, totalSales] = await Promise.all([
                    getProductsApi(),
                    fetchApi<any[]>('/admin/usuarios', { method: 'GET' }).catch(() => []),
                    fetchApi<any[]>('/ordenes', { method: 'GET' }).catch(() => []),
                    fetchApi<number>('/admin/reportes/total-ventas', { method: 'GET' }).catch(() => 0)
                ]);

                setStats({
                    products: products.length,
                    users: users.length,
                    orders: orders.length,
                    sales: totalSales || 0
                });
            } catch (error) {
                console.error("Error cargando estadísticas", error);
            }
        };
        loadStats();
    }, []);

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
                            <span className="stats-card-value">${stats.sales.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-productos">
                        <span className="stats-card-icon">📦</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Productos</span>
                            <span className="stats-card-value">{stats.products}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-usuarios">
                        <span className="stats-card-icon">👥</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Usuarios</span>
                            <span className="stats-card-value">{stats.users}</span>
                        </div>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <div className="stats-card stats-card-ordenes">
                        <span className="stats-card-icon">🧾</span>
                        <div className="stats-card-content">
                            <span className="stats-card-title">Órdenes</span>
                            <span className="stats-card-value">{stats.orders}</span>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="admin-nav-grid">
                <Link to="/admin" className="admin-nav-card">
                    <div className="nav-card-icon">🏠</div>
                    <h5 className="nav-card-title">Dashboard</h5>
                </Link>
                <Link to="/admin/ordenes" className="admin-nav-card">
                    <div className="nav-card-icon">🛒</div>
                    <h5 className="nav-card-title">Órdenes</h5>
                </Link>
                <Link to="/admin/productos" className="admin-nav-card">
                    <div className="nav-card-icon">📦</div>
                    <h5 className="nav-card-title">Productos</h5>
                </Link>
                <Link to="/admin/categorias" className="admin-nav-card">
                    <div className="nav-card-icon">🏷️</div>
                    <h5 className="nav-card-title">Categorías</h5>
                </Link>
                <Link to="/admin/usuarios" className="admin-nav-card">
                    <div className="nav-card-icon">👥</div>
                    <h5 className="nav-card-title">Usuarios</h5>
                </Link>
                <Link to="/admin/reportes" className="admin-nav-card">
                    <div className="nav-card-icon">📊</div>
                    <h5 className="nav-card-title">Reportes</h5>
                </Link>
                <Link to="/admin/perfil" className="admin-nav-card">
                    <div className="nav-card-icon">👤</div>
                    <h5 className="nav-card-title">Perfil</h5>
                </Link>
                <Link to="/" className="admin-nav-card">
                    <div className="nav-card-icon">🌐</div>
                    <h5 className="nav-card-title">Tienda</h5>
                </Link>
            </div>
        </>
    );
};

export default AdminDashboard;