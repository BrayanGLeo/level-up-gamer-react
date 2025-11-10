import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface AdminNotificationModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    message: string;
}

const AdminNotificationModal = ({ show, onHide, title, message }: AdminNotificationModalProps) => {
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