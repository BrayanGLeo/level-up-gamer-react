import React from 'react';
import '../../styles/Contacto.css';

const ContactoPage = () => {
    return (
        <main className="main-content" style={{ paddingTop: '100px' }}>
            <section className="about-us-section">
                <div className="container">
                    <h2 className="section-title">Acerca de Nosotros</h2>
                    <p className="about-us-text">
                        Level-Up Gamer nació de una pasión compartida por el increíble mundo de los videojuegos. Somos más que una tienda; somos una comunidad de jugadores dedicados a ofrecer los mejores productos, desde consolas de última generación y PCs de alto rendimiento hasta los accesorios que marcan la diferencia en cada partida. Nuestra misión es potenciar tu experiencia de juego y ayudarte a alcanzar el siguiente nivel. ¡Únete a nosotros y desafía tus límites!
                    </p>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2 className="section-title">Medios de Contacto</h2>
                    <div className="contact-info-container">
                        <div className="contact-info">
                            <h3>Información Directa</h3>
                            <ul>
                                <li><strong>📧 Correo Electrónico:</strong> <a href="mailto:soporte@levelupgamer.cl">soporte@levelupgamer.cl</a></li>
                                <li><strong>📞 Teléfono:</strong> <a href="tel:+56912345678">+56 9 1234 5678</a></li>
                                <li><strong>📍 Dirección:</strong> Calle Falsa 123, Springfield, Chile</li>
                            </ul>
                            <a href="https://api.whatsapp.com/send?phone=56912345678&text=Hola,%20necesito%20ayuda%20con%20un%20producto." className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                                Chatea con Nosotros en WhatsApp
                            </a>
                        </div>
                        <div className="contact-social">
                            <h3>Síguenos en Redes</h3>
                            <ul>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactoPage;