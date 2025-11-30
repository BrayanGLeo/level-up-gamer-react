import { describe, test, expect } from 'vitest';
import { getBlogPosts, getBlogPostById, blogPosts } from '../../src/data/blogData';

describe('Blog Data', () => {
    test('getBlogPosts debe retornar todos los posts', () => {
        const posts = getBlogPosts();
        expect(posts).toEqual(blogPosts);
        expect(posts.length).toBe(blogPosts.length);
    });

    test('getBlogPostById debe retornar el post correcto para un ID válido', () => {
        const post = getBlogPostById(1);
        expect(post).toBeDefined();
        expect(post?.id).toBe(1);
        expect(post?.title).toBe('PlayStation anuncia los 8 juegos gratis de septiembre de 2025 para miembros de PS Plus Extra y Premium');
    });

    test('getBlogPostById debe retornar undefined para un ID inválido', () => {
        const post = getBlogPostById(999);
        expect(post).toBeUndefined();
    });
});
