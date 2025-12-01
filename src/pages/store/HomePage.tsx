import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import BlogPostSummary from '../../components/BlogPostSummary';
import { getProductsApi } from '../../utils/api';
import { Product } from '../../data/productData';
import { getBlogPosts } from '../../data/blogData';
import heroBackground from '../../assets/Fondo.png';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    const featuredPosts = getBlogPosts().slice(0, 2);
    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const allProducts = await getProductsApi();
                setFeaturedProducts(allProducts.slice(0, 4));
            } catch (error) {
                console.error("Error cargando productos destacados", error);
            } finally {
                setLoading(false);
            }
        };
        loadFeatured();
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setSelectedProduct(product);
        setShowModal(true);
    };

    const heroStyle = {
        backgroundImage: `url(${heroBackground})`
    };

    return (
        <>
            <section className="hero" style={heroStyle}>
                <div className="container">
                    <h2 className="hero-title">¡Desafía tus límites con Level-Up Gamer!</h2>
                    <p className="hero-text">Conviértete en un Pro Gamer con nuestros productos y únete a nuestra comunidad de jugadores. ¡Explora, mejora y gana con nosotros!</p>
                    <Link to="/catalogo" className="btn">Explorar Productos</Link>
                </div>
            </section>

            <section id="featured-products" className="section-catalogo" style={{ paddingTop: '50px', backgroundColor: '#111' }}>
                <Container>
                    <h2 className="section-title">Productos Destacados</h2>
                    {loading ? (
                        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Row>
                            {featuredProducts.map(product => (
                                <Col key={product.codigo} md={4} lg={3} className="mb-4">
                                    <ProductCard
                                        product={product}
                                        onAddToCartClick={handleAddToCart}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>

            <section id="blog" className="section-blog">
                <div className="container">
                    <h2 className="section-title">Novedades y Guías</h2>
                    <Row>
                        {featuredPosts.map(post => (
                            <Col key={post.id} md={6} className="mb-4">
                                <BlogPostSummary post={post} />
                            </Col>
                        ))}
                    </Row>
                    <Link to="/blog" className="btn">Ver Más Novedades</Link>
                </div>
            </section>

            <AddToCartModal
                show={showModal}
                onHide={() => setShowModal(false)}
                product={selectedProduct}
            />
        </>
    );
};

export default HomePage;