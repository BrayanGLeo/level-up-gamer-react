import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from '../../../src/pages/store/BlogPage';
import * as blogData from '../../../src/data/blogData';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: (props) => <a href={props.to} {...props}>{props.children}</a>
}));

const mockPosts = [
    { id: 1, title: 'Post de Prueba 1', date: '01 Enero 2025', content: 'Contenido 1', image: 'img1.jpg' },
    { id: 2, title: 'Post de Prueba 2', date: '02 Enero 2025', content: 'Contenido 2', image: 'img2.jpg' },
];

const mockGetBlogPosts = jest.spyOn(blogData, 'getBlogPosts');

describe('BlogPage', () => {

    beforeEach(() => {
        mockGetBlogPosts.mockReturnValue(mockPosts);
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