import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import '../styles/Modal.css';

const RemoveFromCartModal = ({ show, onHide, onConfirm, product }) => {
    if (!product) return null;

    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar Producto?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que quieres eliminar este producto del carrito?</p>
                
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
                    Cancelar
                </Button>
                <Button className="btn-danger-neon" onClick={onConfirm}>
                    Sí, Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RemoveFromCartModal;