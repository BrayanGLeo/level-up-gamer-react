import React from 'react';
import { Container } from 'react-bootstrap';
import BlogCard from '../../components/BlogCard';
import { getBlogPosts } from '../../data/blogData';
import '../../styles/Blog.css';

const BlogPage = () => {
    const posts = getBlogPosts();

    return (
        <main className="blog-main">
            <section id="blog-content" className="container">
                <h2 className="section-title">Nuestro Blog Gamer</h2>
                <p className="text-secondary" style={{ textAlign: 'center' }}>
                    Mantente al día con las últimas noticias y análisis de tus juegos favoritos.
                </p>

                <div className="blog-grid">
                    {posts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default BlogPage;