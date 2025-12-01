import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import PerfilPage from '../../../src/pages/store/PerfilPage';
import { useAuth, AuthContextType } from '../../../src/context/AuthContext';
import { User } from '../../../src/data/userData';

vi.mock('../../../src/context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

const mockUseAuth = useAuth as vi.Mock;

const renderPerfilPage = () => {
    return render(<PerfilPage />);
};

describe('PerfilPage', () => {

    test('renderiza la información del usuario logueado', () => {
        const user: Partial<User> = {
            name: 'Brayan',
            surname: 'Godoy',
            email: 'brayan@gmail.com',
            registeredAt: '10-05-2024'
        };
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: vi.fn() } as Partial<AuthContextType>);

        renderPerfilPage();

        expect(screen.getByText('Brayan Godoy')).toBeInTheDocument();
        expect(screen.getByText('brayan@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('10-05-2024')).toBeInTheDocument();
    });

    test('renderiza "Fecha no registrada" si el usuario no tiene la propiedad', () => {
        const oldUser: Partial<User> = {
            name: 'Admin',
            surname: 'Test',
            email: 'admin@admin.cl'
        };
        mockUseAuth.mockReturnValue({ currentUser: oldUser, updateCurrentUser: vi.fn() } as Partial<AuthContextType>);

        renderPerfilPage();

        expect(screen.getByText('Admin Test')).toBeInTheDocument();
        expect(screen.getByText('admin@admin.cl')).toBeInTheDocument();
        expect(screen.getByText('Fecha no registrada')).toBeInTheDocument();
    });

    test('muestra estado inicial cuando no hay usuario', () => {
        mockUseAuth.mockReturnValue({ currentUser: null, updateCurrentUser: vi.fn() } as Partial<AuthContextType>);

        render(<PerfilPage />);

        expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
        const img = screen.getByAltText('Foto de perfil') as HTMLImageElement;
        expect(img.src).toContain('via.placeholder.com');
    });

    test('al subir una imagen actualiza el src y llama a updateCurrentUser', async () => {
        const user: Partial<User> = {
            name: 'Test',
            surname: 'User',
            email: 'test@user.com',
            registeredAt: '01-01-2020',
            profilePic: 'https://via.placeholder.com/150'
        };

        const mockUpdate = vi.fn();

        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: mockUpdate } as Partial<AuthContextType>);

        const originalFileReader = (globalThis as any).FileReader;
        class MockFileReader {
            onload: ((ev: any) => void) | null = null;
            readAsDataURL(_file: any) {
                if (this.onload) {
                    this.onload({ target: { result: 'data:image/png;base64,fake' } });
                }
            }
        }
        (globalThis as any).FileReader = MockFileReader;

        try {
            render(<PerfilPage />);
            const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });

            const input = document.getElementById('file-input') as HTMLInputElement;
            fireEvent.change(input, { target: { files: [file] } });

            await waitFor(() => expect(mockUpdate).toHaveBeenCalled());

            const img = screen.getByAltText('Foto de perfil') as HTMLImageElement;
            expect(img.src).toContain('data:image/png;base64,fake');

            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ profilePic: 'data:image/png;base64,fake' }));

        } finally {
            (globalThis as any).FileReader = originalFileReader;
        }
    });

    test('no hace nada si FileReader no produce un resultado', async () => {
        const user: Partial<User> = { name: 'Test', surname: 'User', email: 'test@user.com' };
        const mockUpdate = vi.fn();
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: mockUpdate });

        const originalFileReader = (globalThis as any).FileReader;
        class MockFileReader {
            onload: ((ev: any) => void) | null = null;
            readAsDataURL(_file: any) {
                if (this.onload) {
                    this.onload({ target: { result: null } });
                }
            }
        }
        (globalThis as any).FileReader = MockFileReader;

        try {
            render(<PerfilPage />);
            const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });

            const input = document.getElementById('file-input') as HTMLInputElement;
            fireEvent.change(input, { target: { files: [file] } });

            await new Promise(r => setTimeout(r, 100));

            expect(mockUpdate).not.toHaveBeenCalled();

        } finally {
            (globalThis as any).FileReader = originalFileReader;
        }
    });

    test('no hace nada cuando no se selecciona archivo', async () => {
        const user: Partial<User> = { name: 'Test', surname: 'User', email: 'test@user.com' };
        const mockUpdate = vi.fn();
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: mockUpdate });

        render(<PerfilPage />);

        const input = document.getElementById('file-input') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [] } });

        await new Promise(r => setTimeout(r, 100));

        expect(mockUpdate).not.toHaveBeenCalled();
    });

    test('triggerFileInput makes click on file input', () => {
        const user: Partial<User> = { name: 'Test', surname: 'User', email: 'test@user.com' };
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: vi.fn() });

        render(<PerfilPage />);

        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        const clickSpy = vi.spyOn(fileInput, 'click');

        const uploadButton = screen.getByText('Cambiar Foto');
        fireEvent.click(uploadButton);

        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });
});