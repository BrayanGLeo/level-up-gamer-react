import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AdminNotificationModal = ({ show, onHide, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminNotificationModal;