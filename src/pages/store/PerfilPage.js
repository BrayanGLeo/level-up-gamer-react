import React, { useState, useEffect } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Perfil.css';

const PerfilPage = () => {
    const { currentUser, updateCurrentUser } = useAuth();

    const [profilePic, setProfilePic] = useState(
        currentUser?.profilePic || 'https://via.placeholder.com/150'
    );

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        memberSince: 'Septiembre 2025'
    });

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: `${currentUser.name} ${currentUser.surname}`,
                email: currentUser.email,
                memberSince: 'Septiembre 2025'
            });

            setProfilePic(currentUser.profilePic || 'https://via.placeholder.com/150');
        }
    }, [currentUser]);

    const handlePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const picData = e.target.result;
                
                setProfilePic(picData);

                if (currentUser) {
                    const updatedUser = { ...currentUser, profilePic: picData };
                    updateCurrentUser(updatedUser);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };


    return (
        <main className="main-content" style={{ paddingTop: '100px' }}>
            <section className="profile-section">
                <Container>
                    <h2 className="section-title">Mi Perfil</h2>
                    <div className="profile-container">
                        <div className="profile-picture-container">
                            <Image src={profilePic} alt="Foto de perfil" id="profile-pic" roundedCircle />

                            <input
                                type="file"
                                id="file-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePicChange}
                            />

                            <Button className="btn" id="change-pic-btn" onClick={triggerFileInput}>
                                Cambiar Foto
                            </Button>
                        </div>
                        <div className="profile-details">
                            <h3>Nombre de Usuario</h3>
                            <p id="user-name">{profileData.name}</p>
                            <h3>Correo Electrónico</h3>
                            <p id="user-email">{profileData.email}</p>
                            <h3>Miembro Desde</h3>
                            <p id="user-since">{profileData.memberSince}</p>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
};

export default PerfilPage;