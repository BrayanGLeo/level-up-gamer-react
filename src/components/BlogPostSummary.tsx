import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import { BlogPost } from '../data/blogData';

interface BlogPostSummaryProps {
    post: BlogPost;
}

const BlogPostSummary = ({ post }: BlogPostSummaryProps) => {
    return (
        <div className="blog-post">
            <h3>
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </h3>
            <p className="text-secondary">
                {post.content.substring(0, 100)}...
            </p>
        </div>
    );
};

export default BlogPostSummary;