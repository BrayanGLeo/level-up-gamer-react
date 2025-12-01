import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import BlogPage from '../../../src/pages/store/BlogPage';
import * as api from '../../../src/utils/api';
import { BlogPost } from '../../../src/data/blogData';

vi.mock('../../../src/utils/api', () => ({
    getBlogPostsApi: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});

const mockPosts: BlogPost[] = [
    { id: 1, title: 'Post de Prueba 1', date: '2025-01-01', content: 'Contenido 1', image: 'img1.jpg' },
    { id: 2, title: 'Post de Prueba 2', date: '2025-01-02', content: 'Contenido 2', image: 'img2.jpg' },
];

describe('BlogPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (api.getBlogPostsApi as any).mockResolvedValue(mockPosts);
    });

    test('renderiza la lista de posts del blog después de cargar', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <BlogPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Nuestro Blog Gamer')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Post de Prueba 1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Post de Prueba 2')).toBeInTheDocument();
        expect(screen.getAllByText('Leer Más').length).toBe(2);
    });

    test('muestra mensaje de error si la API falla', async () => {
        (api.getBlogPostsApi as any).mockRejectedValue(new Error('Error de red'));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <BlogPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No se pudieron cargar las noticias/i)).toBeInTheDocument();
        });
    });
});