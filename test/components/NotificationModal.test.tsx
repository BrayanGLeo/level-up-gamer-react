import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import NotificationModal from '../../src/components/NotificationModal';

describe('NotificationModal', () => {

    test('renderiza el título y el mensaje', () => {
        const mockOnHide = vi.fn();

        render(
            <NotificationModal
                show={true}
                onHide={mockOnHide}
                title="Título de Prueba"
                message="Mensaje de Prueba"
            />
        );

        expect(screen.getByText('Título de Prueba')).toBeInTheDocument();
        expect(screen.getByText('Mensaje de Prueba')).toBeInTheDocument();
    });

    test('llama a onHide al hacer clic en Aceptar', () => {
        const mockOnHide = vi.fn();

        render(
            <NotificationModal
                show={true}
                onHide={mockOnHide}
                title="Test"
                message="Test"
            />
        );

        const acceptButton = screen.getByRole('button', { name: /Aceptar/i });
        fireEvent.click(acceptButton);

        expect(mockOnHide).toHaveBeenCalledTimes(1);
    });
});