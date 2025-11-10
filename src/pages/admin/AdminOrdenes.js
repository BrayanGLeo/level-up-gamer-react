import React from 'react';
import { Card } from 'react-bootstrap';

const AdminOrdenes = () => {
    return (
        <>
            <div className="admin-page-header">
                <h1>Órdenes</h1>
            </div>
            <Card className="admin-card">
                <Card.Body>
                    <div className="text-center p-5">
                        <span style={{ fontSize: '3rem' }}>🛒</span>
                        <h3 className="mt-3">Módulo de Órdenes</h3>
                        <p className="text-muted">
                            Esta sección está en desarrollo. Aquí podrás ver y gestionar
                            todas las órdenes de compra realizadas por los clientes.
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default AdminOrdenes;