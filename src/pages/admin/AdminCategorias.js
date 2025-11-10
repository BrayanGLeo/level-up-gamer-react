import React from 'react';
import { Card } from 'react-bootstrap';

const AdminCategorias = () => {
    return (
        <>
            <div className="admin-page-header">
                <h1>Categorías</h1>
            </div>
            <Card className="admin-card">
                <Card.Body>
                    <div className="text-center p-5">
                        <span style={{ fontSize: '3rem' }}>🏷️</span>
                        <h3 className="mt-3">Módulo de Categorías</h3>
                        <p className="text-muted">
                            Esta sección está en desarrollo. Aquí podrás crear, editar y
                            eliminar las categorías de productos de la tienda.
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default AdminCategorias;