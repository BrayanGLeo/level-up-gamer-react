import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/Modal.css';

const NotificationModal = ({ show, onHide, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn" onClick={onHide}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;