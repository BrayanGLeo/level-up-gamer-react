import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import BlogDetailPage from '../../../src/pages/store/BlogDetailPage';
import * as api from '../../../src/utils/api';
import { BlogPost } from '../../../src/data/blogData';

vi.mock('../../../src/utils/api', () => ({
    getBlogPostByIdApi: vi.fn(),
}));

const mockPost: BlogPost = {
    id: 1,
    title: 'Detalle del Post',
    date: '2025-01-01',
    content: 'Contenido completo del post.',
    image: 'img.jpg'
};

describe('BlogDetailPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renderiza el detalle del post correctamente', async () => {
        (api.getBlogPostByIdApi as any).mockResolvedValue(mockPost);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/blog/1']}>
                <Routes>
                    <Route path="/blog/:id" element={<BlogDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Detalle del Post')).toBeInTheDocument();
        });

        expect(screen.getByText('Publicado el 2025-01-01')).toBeInTheDocument();
        expect(screen.getByText('Contenido completo del post.')).toBeInTheDocument();
    });

    test('muestra mensaje de "Post no encontrado" si la API devuelve null o error', async () => {
        (api.getBlogPostByIdApi as any).mockResolvedValue(null);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/blog/999']}>
                <Routes>
                    <Route path="/blog/:id" element={<BlogDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Post no encontrado')).toBeInTheDocument();
        });

        expect(screen.getByText(/Volver al blog/i)).toBeInTheDocument();
    });
});