import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/Modal.css';

const ClearCartModal = ({ show, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>¿Vaciar Carrito?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que quieres eliminar **todos** los productos del carrito?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-light" onClick={onHide}>
                    Cancelar
                </Button>
                <Button className="btn-danger-neon" onClick={onConfirm}>
                    Sí, Vaciar Carrito
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClearCartModal;