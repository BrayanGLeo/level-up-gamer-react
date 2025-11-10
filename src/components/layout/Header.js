import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationModal from '../NotificationModal';
import '../../styles/App.css';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();

    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const handleLogout = () => {
        const result = logout();
        setModalInfo({ show: true, title: '¡Sesión Cerrada!', message: result.message });
    };

    const handleModalClose = () => {
        setModalInfo({ show: false, title: '', message: '' });
        navigate('/');
    };

    return (
        <>
            <Navbar bg="black" variant="dark" expand="lg" fixed="top" className="header-nav">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="logo">LEVEL-UP GAMER</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/catalogo">Catálogo</Nav.Link>
                            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
                            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>

                            {currentUser ? (
                                <NavDropdown title={`Hola, ${currentUser.name}`} id="profile-dropdown">
                                    
                                    {(currentUser.role === 'Administrador' || currentUser.role === 'Vendedor') && (
                                        <NavDropdown.Item as={Link} to="/admin">
                                            {currentUser.role === 'Administrador' ? 'Panel Admin' : 'Panel Vendedor'}
                                        </NavDropdown.Item>
                                    )}

                                    <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/privacidad">Configuración</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/pedidos">Mis Pedidos</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/direcciones">Mis Direcciones</NavDropdown.Item>
                                    <NavDropdown.Divider />

                                    <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} to="/login" id="login-nav-item">Iniciar Sesión</Nav.Link>
                            )}

                            <Nav.Link as={Link} to="/carrito">
                                🛒 Carrito
                                <Badge pill bg="primary" style={{ marginLeft: '5px' }}>
                                    {getCartItemCount()}
                                </Badge>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <NotificationModal
                show={modalInfo.show}
                onHide={handleModalClose}
                title={modalInfo.title}
                message={modalInfo.message}
            />
        </>
    );
};

export default Header;