import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/App.css';

const OrderErrorPage = () => {
    return (
        <Container style={{ paddingTop: '100px', minHeight: '70vh', textAlign: 'center' }}>
            <Alert variant="danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Alert.Heading>¡Error en el Pago!</Alert.Heading>
                <p>
                    No se pudo procesar tu pago. (nro #20240705 simulado)
                </p>
                <p>
                    Por favor, verifica tu información e inténtalo de nuevo.
                </p>
                <hr />
                <p className="mb-0">
                    Si el problema persiste, contacta con nuestro soporte.
                </p>
            </Alert>

            <div style={{ marginTop: '20px' }}>
                <Button as={Link} to="/checkout" variant="danger" className="me-2 btn">
                    Volver a Realizar el Pago
                </Button>
                <Button as={Link} to="/catalogo" variant="outline-light">
                    Volver al Catálogo
                </Button>
            </div>
        </Container>
    );
};

export default OrderErrorPage;