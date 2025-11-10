import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/AdminStyle.css';
import { getProducts } from '../../data/productData';
import { getUsers } from '../../data/userData';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const allProducts = getProducts();
    const productCount = allProducts.length;
    const userCount = getUsers().length;
    
    const purchaseCount = 1234; 
    const totalSales = 5839020; 

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
            <Row className="admin-nav-grid">
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">🏠</div>
                            <Card.Title>Dashboard</Card.Title>
                            <Card.Text>Visión general de todas las métricas y estadísticas.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/ordenes" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">🛒</div>
                            <Card.Title>Órdenes</Card.Title>
                            <Card.Text>Gestión y seguimiento de todas las órdenes de compra.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/productos" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">📦</div>
                            <Card.Title>Productos</Card.Title>
                            <Card.Text>Administrar inventario y detalles de los productos.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/categorias" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">🏷️</div>
                            <Card.Title>Categorías</Card.Title>
                            <Card.Text>Organizar productos en categorías para facilitar su navegación.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/usuarios" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">👥</div>
                            <Card.Title>Usuarios</Card.Title>
                            <Card.Text>Gestión de cuentas de usuario y sus roles del sistema.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/reportes" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">📊</div>
                            <Card.Title>Reportes</Card.Title>
                            <Card.Text>Generación de informes detallados sobre las operaciones.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/admin/perfil" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">👤</div>
                            <Card.Title>Perfil</Card.Title>
                            <Card.Text>Administración de la información personal y configuraciones.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <Card as={Link} to="/" className="nav-card-action">
                        <Card.Body className="text-center">
                            <div className="nav-card-icon">🌐</div>
                            <Card.Title>Tienda</Card.Title>
                            <Card.Text>Visualizar la tienda en tiempo real y ver los reportes de usuario.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboard;