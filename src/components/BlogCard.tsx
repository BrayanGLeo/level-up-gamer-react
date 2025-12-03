import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Blog.css';
import { BlogPost } from '../data/blogData';

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
    const { id, title, date, image, summary, content } = post;

    return (
        <article className="blog-card">
            <img src={image} alt={title} className="blog-card-img-1" />
            <h3>{title}</h3>
            <p className="blog-meta">Publicado el {date}</p>
            <p>{summary || content.substring(0, 150) + "..."}</p>
            <Link to={`/blog/${id}`} className="btn-small">Leer Más</Link>
        </article>
    );
};

export default BlogCard;