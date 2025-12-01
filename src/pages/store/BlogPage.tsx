import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import BlogCard from '../../components/BlogCard';
import { BlogPost } from '../../data/blogData';
import { getBlogPostsApi } from '../../utils/api';
import '../../styles/Blog.css';

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getBlogPostsApi();
                setPosts(data);
            } catch (err) {
                console.error("Error cargando blog", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <main className="blog-main">
            <section id="blog-content" className="container">
                <h2 className="section-title">Nuestro Blog Gamer</h2>
                <p className="text-secondary" style={{ textAlign: 'center' }}>
                    Mantente al día con las últimas noticias y análisis de tus juegos favoritos.
                </p>

                {loading && (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {error && !loading && (
                    <Alert variant="danger" className="text-center">
                        No se pudieron cargar las noticias. Intenta más tarde.
                    </Alert>
                )}

                {!loading && !error && (
                    <div className="blog-grid">
                        {posts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default BlogPage;