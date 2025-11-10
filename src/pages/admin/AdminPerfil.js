import React from 'react';
import { Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const AdminPerfil = () => {
    const { currentUser } = useAuth();

    return (
        <>
            <div className="admin-page-header">
                <h1>Perfil</h1>
            </div>
            <Card className="admin-card">
                 <Card.Header>Información de Administrador</Card.Header>
                <Card.Body>
                    <div className="p-4">
                        <h4>Nombre: {currentUser.name} {currentUser.surname}</h4>
                        <p className="text-muted">Email: {currentUser.email}</p>
                        <p className="text-muted">Rol: {currentUser.role}</p>
                        <p className="text-muted mt-4">
                            Aquí podrás editar tu información personal y cambiar tu contraseña.
                            (Funcionalidad próximamente).
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default AdminPerfil;