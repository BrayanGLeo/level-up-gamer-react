import React from 'react';
import { Modal, Button, Image, Row, Col } from 'react-bootstrap';
import '../styles/Modal.css';
import '../styles/Perfil.css';

const OrderDetailModal = ({ show, onHide, order }) => {
    if (!order) return null;

    const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`;

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Pedido #{order.number}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={7} className="order-items-column">
                        <h4>Artículos Comprados</h4>
                        <div className="order-items">
                            {order.items.map(item => (
                                <div className="order-item" key={item.codigo}>
                                    <Image src={item.imagen} alt={item.nombre} className="order-item-image" />
                                    <div className="order-item-info-modal">
                                        <strong>{item.nombre}</strong>
                                        
                                        <span style={{ color: '#D3D3D3' }}>
                                            (x{item.quantity} - {formatPrice(item.precio)} c/u)
                                        </span>
                                    </div>
                                    <span>{formatPrice(item.precio * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <h4 className="text-end mt-3">Total: {formatPrice(order.total)}</h4>
                    </Col>
                    
                    <Col md={5} className="order-shipping-column">
                        <h4>Información de Entrega</h4>
                        {order.shipping.type === 'Retiro en Tienda' ? (
                            <div>
                                <strong>Tipo de Entrega:</strong>
                                <p>Retiro en Tienda</p>
                                <strong>Dirección:</strong>
                                <p>Calle Falsa 123, Springfield</p>
                            </div>
                        ) : (
                            <div>
                                <strong>Tipo de Entrega:</strong>
                                <p>Despacho a Domicilio</p>
                                <strong>Recibe:</strong>
                                <p>{order.shipping.recibeNombre} {order.shipping.recibeApellido} ({order.shipping.recibeTelefono})</p>
                                <strong>Dirección:</strong>
                                <p>
                                    {order.shipping.calle} {order.shipping.numero}
                                    {order.shipping.depto && `, ${order.shipping.depto}`}
                                    <br/>
                                    {order.shipping.comuna}, {order.shipping.region}
                                </p>
                            </div>
                        )}
                        <hr />
                        <h4>Datos del Comprador</h4>
                        <p>
                            {order.customer.name} {order.customer.surname}
                            <br/>
                            {order.customer.email}
                        </p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;