import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Carrito.css';
import RemoveFromCartModal from '../../components/RemoveFromCartModal';
import ClearCartModal from '../../components/ClearCartModal';

const CartPage = () => {
    const { cartItems, updateQuantity, clearCart, getCartTotal, removeFromCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);

    const handleCheckoutClick = () => {
        if (currentUser) {
            navigate('/checkout');
        } else {
            setShowLoginModal(true);
        }
    };
    const handleGuestCheckout = () => {
        setShowLoginModal(false);
        navigate('/checkout');
    };

    const handleOpenRemoveModal = (product) => {
        setProductToRemove(product);
        setShowRemoveModal(true);
    };
    const handleCloseRemoveModal = () => {
        setShowRemoveModal(false);
        setProductToRemove(null);
    };
    const handleConfirmRemove = () => {
        if (productToRemove) {
            removeFromCart(productToRemove.codigo);
        }
        handleCloseRemoveModal();
    };

    const handleOpenClearModal = () => {
        setShowClearModal(true);
    };
    const handleCloseClearModal = () => {
        setShowClearModal(false);
    };
    const handleConfirmClearCart = () => {
        clearCart();
        handleCloseClearModal();
    };

    return (
        <>
            <main>
                <section className="section-catalogo">
                    <Container>
                        <h2 className="section-title">Mi Carrito</h2>

                        {cartItems.length === 0 ? (
                            <div id="carrito-vacio">
                                <p>Tu carrito está vacío. <Link to="/catalogo">¡Vamos a llenarlo!</Link></p>
                            </div>
                        ) : (
                            <>
                                <div className="carrito-items-container">
                                    {cartItems.map(item => (
                                        <div key={item.codigo} className="carrito-item">
                                            <img src={item.imagen} alt={item.nombre} className="carrito-item-imagen" />
                                            <div className="carrito-item-info">
                                                <div>
                                                    <h3>{item.nombre}</h3>
                                                    <div className="carrito-item-cantidad">
                                                        <button
                                                            className="btn-cantidad restar-item"
                                                            onClick={() => updateQuantity(item.codigo, -1)}
                                                        >-</button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            className="btn-cantidad sumar-item"
                                                            onClick={() => updateQuantity(item.codigo, 1)}
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <p className="carrito-item-precio">
                                                    ${(item.precio * item.quantity).toLocaleString('es-CL')}
                                                </p>
                                                
                                                <button
                                                    className="btn-remove-item"
                                                    onClick={() => handleOpenRemoveModal(item)}
                                                    title="Eliminar producto del carrito"
                                                >
                                                    X
                                                </button>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div id="carrito-acciones">
                                    <div className="carrito-acciones-container">
                                        <h3>Total: <span id="total-precio">${getCartTotal().toLocaleString('es-CL')} CLP</span></h3>
                                        <div className="carrito-botones">
                                            <Button id="vaciar-carrito" variant="danger" onClick={handleOpenClearModal}>
                                                Vaciar Carrito
                                            </Button>
                                            <Button onClick={handleCheckoutClick} className="btn">
                                                Finalizar Compra
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </Container>
                </section>
            </main>

            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¿Cómo quieres continuar?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para continuar con tu compra, puedes iniciar sesión o registrarte. Si lo prefieres, puedes avanzar como invitado.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between w-100">
                    <Button variant="primary" as={Link} to="/login" onClick={() => setShowLoginModal(false)}>
                        Iniciar Sesión
                    </Button>
                    <Button variant="success" as={Link} to="/register" onClick={() => setShowLoginModal(false)}>
                        Registrarse
                    </Button>
                    <Button variant="secondary" onClick={handleGuestCheckout}>
                        Avanzar como Invitado
                    </Button>
                </Modal.Footer>
            </Modal>

            <RemoveFromCartModal
                show={showRemoveModal}
                onHide={handleCloseRemoveModal}
                onConfirm={handleConfirmRemove}
                product={productToRemove}
            />

            <ClearCartModal
                show={showClearModal}
                onHide={handleCloseClearModal}
                onConfirm={handleConfirmClearCart}
            />
        </>
    );
};

export default CartPage;