import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import BlogPostSummary from '../../components/BlogPostSummary';
import { getProductsApi, getBlogPostsApi } from '../../utils/api';
import { Product } from '../../data/productData';
import { BlogPost } from '../../data/blogData';
import heroBackground from '../../assets/Fondo.png';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingBlog, setLoadingBlog] = useState(true);

    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const allProducts = await getProductsApi();
                setFeaturedProducts(allProducts.slice(0, 4));
            } catch (e) { console.error(e); }
            finally { setLoadingProducts(false); }

            try {
                const allPosts = await getBlogPostsApi();
                setFeaturedPosts(allPosts.slice(0, 2));
            } catch (e) { console.error(e); }
            finally { setLoadingBlog(false); }
        };
        loadData();
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setSelectedProduct(product);
        setShowModal(true);
    };

    const heroStyle = { backgroundImage: `url(${heroBackground})` };

    return (
        <>
            <section className="hero" style={heroStyle}>
                <div className="container">
                    <h2 className="hero-title">¡Desafía tus límites con Level-Up Gamer!</h2>
                    <p className="hero-text">Conviértete en un Pro Gamer con nuestros productos, estando seguro que son de la máxima calidad del mercado</p>
                    <Link to="/catalogo" className="btn">Explorar Productos</Link>
                </div>
            </section>

            <section id="featured-products" className="section-catalogo" style={{ paddingTop: '50px', backgroundColor: '#111' }}>
                <Container>
                    <h2 className="section-title">Productos Destacados</h2>
                    {loadingProducts ? (
                        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Row>
                            {featuredProducts.map(product => (
                                <Col key={product.codigo} md={4} lg={3} className="mb-4">
                                    <ProductCard product={product} onAddToCartClick={handleAddToCart} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </section>

            <section id="blog" className="section-blog">
                <div className="container">
                    <h2 className="section-title">Novedades y Guías</h2>
                    {loadingBlog ? (
                        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Row>
                            {featuredPosts.map(post => (
                                <Col key={post.id} md={6} className="mb-4">
                                    <BlogPostSummary post={post} />
                                </Col>
                            ))}
                        </Row>
                    )}
                    <Link to="/blog" className="btn">Ver Más Novedades</Link>
                </div>
            </section>

            <AddToCartModal show={showModal} onHide={() => setShowModal(false)} product={selectedProduct} />
        </>
    );
};

export default HomePage;