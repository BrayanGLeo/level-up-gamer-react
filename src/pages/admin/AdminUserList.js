import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUserByRut } from '../../data/userData';
import { useAuth } from '../../context/AuthContext';
import EmailHistoryModal from '../../components/EmailHistoryModal';
import '../../styles/AdminStyle.css';

const AdminUserList = () => {
    const [products, setUsers] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setUsers(getUsers());
    }, [currentUser]);

    const handleDelete = (rut) => {
        if (rut === '12345678-9') {
            alert('No puedes eliminar al administrador principal.');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            deleteUserByRut(rut);
            setUsers(getUsers());
        }
    };

    const handleShowHistory = (user) => {
        setSelectedUser(user);
        setShowHistoryModal(true);
    };

    const handleCloseHistory = () => {
        setShowHistoryModal(false);
        setSelectedUser(null);
    };

    return (
        <>
            <header className="admin-header">
                <h1>Usuarios</h1>
                <Button as={Link} to="/admin/usuarios/nuevo" className="btn-admin">
                    Nuevo Usuario
                </Button>
            </header>
            <section className="admin-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>RUN</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(user => (
                            <tr key={user.rut}>
                                <td>{user.rut || 'N/A'}</td>
                                <td>{user.name} {user.surname}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => navigate(`/admin/usuarios/editar/${user.rut}`)}
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowHistory(user)}
                                    >
                                        Historial
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.rut)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>

            <EmailHistoryModal
                show={showHistoryModal}
                onHide={handleCloseHistory}
                user={selectedUser}
            />
        </>
    );
};

export default AdminUserList;