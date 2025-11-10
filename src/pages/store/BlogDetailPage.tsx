import React from 'react';
import { Container, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById } from '../../data/blogData';
import '../../styles/Blog.css';

const BlogDetailPage = () => {
    const { id } = useParams();
    const post = getBlogPostById(parseInt(id));

    if (!post) {
        return (
            <Container className="blog-main">
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
                <Image src={post.image} fluid style={{ margin: '20px auto', display: 'block', maxHeight: '400px' }} />
                <p style={{ maxWidth: '800px', margin: '20px auto', lineHeight: '1.7' }}>
                    {post.content}
                </p>
                <p style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/blog" className="btn">Volver al Blog</Link>
                </p>
            </Container>
        </main>
    );
};

export default BlogDetailPage;