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

const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

const mockPost: BlogPost = {
    id: 1,
    title: 'Detalle del Post',
    date: '2025-01-01',
    content: 'Contenido.',
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
                <Routes><Route path="/blog/:id" element={<BlogDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Detalle del Post')).toBeInTheDocument());
        expect(screen.getByText('Contenido.')).toBeInTheDocument();
    });

    test('maneja error de la API correctamente (entra al catch)', async () => {
        (api.getBlogPostByIdApi as any).mockRejectedValue(new Error('Error de conexión'));

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/blog/1']}>
                <Routes><Route path="/blog/:id" element={<BlogDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Post no encontrado')).toBeInTheDocument());
        expect(consoleSpy).toHaveBeenCalledWith("Error cargando post", expect.any(Error));
    });

    test('maneja id indefinido', async () => {
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <BlogDetailPage />
            </MemoryRouter>
        );
        expect(api.getBlogPostByIdApi).not.toHaveBeenCalled();
    });
});