import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/AdminStyle.css';

const AdminConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminConfirmModal;