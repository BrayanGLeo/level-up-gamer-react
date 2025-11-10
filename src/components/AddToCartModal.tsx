import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Modal.css';

const AddToCartModal = ({ show, onHide, product }) => {
    if (!product) return null;

    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>¡Añadido al carrito!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-product-details">
                    <Image src={product.imagen} alt={product.nombre} className="modal-product-image" />
                    <div className="modal-product-info">
                        <h5>{product.nombre}</h5>
                        <p className="product-price">${product.precio.toLocaleString('es-CL')} CLP</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-light" onClick={onHide}>
                    Seguir Comprando
                </Button>
                <Button as={Link} to="/carrito" className="btn" onClick={onHide}>
                    Ir al Carrito
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddToCartModal;