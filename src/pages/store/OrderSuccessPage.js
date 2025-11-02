import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
    return (
        <Container style={{ paddingTop: '100px', minHeight: '70vh' }}>
            <Alert variant="success">
                <Alert.Heading>¡Pago Correcto!</Alert.Heading>
                <p>
                    Tu pedido ha sido realizado con éxito. Hemos enviado un correo de confirmación
                    con los detalles de tu compra.
                </p>
                <hr />
                <p className="mb-0">
                    ¡Gracias por preferir Level-Up Gamer!
                </p>
            </Alert>
            <Link to="/catalogo">
                <Button variant="primary">Seguir comprando</Button>
            </Link>
        </Container>
    );
};

export default OrderSuccessPage;