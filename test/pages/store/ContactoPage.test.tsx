import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ContactoPage from '../../../src/pages/store/ContactoPage';

describe('ContactoPage', () => {

    test('renderiza la información de contacto estática', () => {
        render(<ContactoPage />);

        expect(screen.getByText('Acerca de Nosotros')).toBeInTheDocument();
        expect(screen.getByText('Medios de Contacto')).toBeInTheDocument();

        expect(screen.getByText(/soporte@levelupgamer.cl/i)).toBeInTheDocument();
        expect(screen.getByText(/Calle Falsa 123/i)).toBeInTheDocument();

        expect(screen.getByRole('link', { name: /Chatea con Nosotros en WhatsApp/i })).toBeInTheDocument();
    });
});