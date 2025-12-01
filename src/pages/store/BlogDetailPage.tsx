import React, { useState, useEffect } from 'react';
import { Container, Image, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../../data/blogData';
import { getBlogPostByIdApi } from '../../utils/api';
import '../../styles/Blog.css';

const BlogDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getBlogPostByIdApi(parseInt(id));
                setPost(data);
            } catch (err) {
                console.error("Error cargando post", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <Container className="blog-main text-center" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!post) {
        return (
            <Container className="blog-main" style={{ paddingTop: '150px' }}>
                <h2 className="section-title">Post no encontrado</h2>
                <p style={{ textAlign: 'center' }}>
                    <Link to="/blog">Volver al blog</Link>
                </p>
            </Container>
        );
    }

    return (
        <main className="blog-main">
            <Container>
                <h2 className="section-title">{post.title}</h2>
                <p className="blog-meta" style={{ textAlign: 'center' }}>Publicado el {post.date}</p>
                <Image src={post.image} fluid style={{ margin: '20px auto', display: 'block', maxHeight: '400px', borderRadius: '8px' }} />
                <div style={{ maxWidth: '800px', margin: '20px auto', lineHeight: '1.8', color: '#D3D3D3', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                    {post.content}
                </div>
                <p style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/blog" className="btn">Volver al Blog</Link>
                </p>
            </Container>
        </main>
    );
};

export default BlogDetailPage;