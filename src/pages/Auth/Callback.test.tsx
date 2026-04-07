import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';
import Callback from './Callback';

const mockedNavigate = vi.fn();

vi.mock('../../context/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>(
        'react-router-dom',
    );

    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

const mockedUseAuth = vi.mocked(useAuth);

const buildTree = (initialEntry = '/auth/callback?code=test-google-code') => (
    <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
            <Route path='/auth/callback' element={<Callback />} />
        </Routes>
    </MemoryRouter>
);

const renderCallback = (initialEntry = '/auth/callback?code=test-google-code') => {
    const tree = buildTree(initialEntry);

    return {
        initialEntry,
        ...render(tree),
    };
};

describe('Callback', () => {
    let authState: ReturnType<typeof mockedUseAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(api.post).mockResolvedValue({
            data: {
                message: 'Sesion iniciada correctamente',
                token: 'session-token',
            },
        });
        authState = {
            isLoggedIn: false,
            isLoading: true,
            user: null,
            isAdmin: false,
            token: null,
            login: vi.fn(),
            logout: vi.fn(),
        };
        mockedUseAuth.mockImplementation(() => authState);
    });

    it('actualiza el contexto antes de redirigir al panel principal', async () => {
        const view = renderCallback();

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/google/exchange', {
                code: 'test-google-code',
            });
        });
        await waitFor(() => {
            expect(authState.login).toHaveBeenCalledWith('session-token');
        });
        expect(mockedNavigate).not.toHaveBeenCalled();

        authState = {
            ...authState,
            isLoggedIn: true,
            isLoading: false,
            token: null,
        };

        view.rerender(buildTree(view.initialEntry));

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/admin', {
                replace: true,
            });
        });
    });

    it('redirige al inicio cuando no llega codigo en el callback', async () => {
        renderCallback('/auth/callback');

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/', {
                replace: true,
            });
        });
        expect(authState.login).not.toHaveBeenCalled();
    });
});
