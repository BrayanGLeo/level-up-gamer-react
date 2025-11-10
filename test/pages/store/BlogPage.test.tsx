import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, SpyInstance } from 'vitest';
import BlogPage from '../../../src/pages/store/BlogPage';
import * as blogData from '../../../src/data/blogData';
import { BlogPost } from '../../../src/data/blogData';

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});

const mockPosts: BlogPost[] = [
    { id: 1, title: 'Post de Prueba 1', date: '01 Enero 2025', content: 'Contenido 1', image: 'img1.jpg' },
    { id: 2, title: 'Post de Prueba 2', date: '02 Enero 2025', content: 'Contenido 2', image: 'img2.jpg' },
];

let mockGetBlogPosts: SpyInstance<[], BlogPost[]>;

describe('BlogPage', () => {

    beforeEach(() => {
        mockGetBlogPosts = vi.spyOn(blogData, 'getBlogPosts').mockReturnValue(mockPosts);
    });

    test('renderiza la lista de posts del blog', () => {
        render(
            <BrowserRouter>
                <BlogPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Nuestro Blog Gamer')).toBeInTheDocument();
        expect(screen.getByText('Post de Prueba 1')).toBeInTheDocument();
        expect(screen.getByText('Post de Prueba 2')).toBeInTheDocument();
        expect(screen.getAllByText('Leer Más').length).toBe(2);
    });
});