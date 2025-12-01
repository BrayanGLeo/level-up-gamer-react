import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminUsers, deleteUserByRut } from '../../services/adminService';
import { User } from '../../data/userData';
import { useAuth } from '../../context/AuthContext';
import EmailHistoryModal from '../../components/EmailHistoryModal';
import AdminConfirmModal from '../../components/AdminConfirmModal';
import '../../styles/AdminStyle.css';

const AdminUserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await getAdminUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    const handleDelete = (rut: string) => {
        if (rut === '12345678-9') {
            alert('No puedes eliminar al administrador principal.');
            return;
        }
        setUserToDelete(rut);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUserByRut(userToDelete);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user", error);
            }
        }
        setShowConfirmModal(false);
        setUserToDelete(null);
    };

    const handleCloseConfirm = () => {
        setShowConfirmModal(false);
        setUserToDelete(null);
    };

    const handleCloseHistory = () => {
        setShowHistoryModal(false);
        setSelectedUser(null);
    };

    const handleShowHistory = (user: User) => {
        setSelectedUser(user);
        setShowHistoryModal(true);
    };

    const getRoleBadge = (role: User['role']) => {
        if (role === 'Administrador') return <Badge bg="primary">{role}</Badge>;
        if (role === 'Vendedor') return <Badge bg="info">{role}</Badge>;
        return <Badge bg="secondary">{role}</Badge>;
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>Usuarios</h1>
                <Link to="/admin/usuarios/nuevo">
                    <Button className="btn-admin">Nuevo Usuario</Button>
                </Link>
            </div>

            <Card className="admin-card">
                <Card.Header>Lista de Usuarios Registrados</Card.Header>
                <Card.Body>
                    <div className="admin-table-container" style={{ padding: 0, boxShadow: 'none' }}>
                        <Table hover responsive>
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
                                {users.map(user => (
                                    <tr key={user.rut}>
                                        <td>{user.rut || 'N/A'}</td>
                                        <td>{user.name} {user.surname}</td>
                                        <td>{user.email}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => navigate(`/admin/usuarios/editar/${user.rut}`)}>
                                                Editar
                                            </Button>
                                            <Button variant="info" size="sm" className="ms-2" onClick={() => handleShowHistory(user)}>
                                                Historial
                                            </Button>
                                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(user.rut)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            <EmailHistoryModal show={showHistoryModal} onHide={handleCloseHistory} user={selectedUser} />
            <AdminConfirmModal show={showConfirmModal} onHide={handleCloseConfirm} onConfirm={handleConfirmDelete} title="Confirmar Eliminación" message="¿Estás seguro de que quieres eliminar este usuario?" />
        </>
    );
};

export default AdminUserList;