import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import '../styles/Modal.css';

const EmailHistoryModal = ({ show, onHide, user }) => {
    if (!user) return null;

    const history = user.emailHistory || [];
    
    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Historial de Correos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Usuario: <strong>{user.name} {user.surname}</strong></p>
                <p>Correo Actual: <strong>{user.email}</strong></p>
                <hr />
                <h5>Correos Anteriores:</h5>
                {history.length > 0 ? (
                    <ListGroup variant="flush">
                        {history.map((email, index) => (
                            <ListGroup.Item key={index} style={{ backgroundColor: 'transparent', color: '#D3D3D3' }}>
                                {email}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No hay correos anteriores registrados.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailHistoryModal;