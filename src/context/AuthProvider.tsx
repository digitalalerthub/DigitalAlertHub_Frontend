import { useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import type { AuthUser } from './AuthContext';
import { getCanonicalRoleName, isAdminRole } from '../utils/roles';

const AUTH_TOKEN_STORAGE_KEY = 'token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const normalizeUser = (rawUser: unknown): AuthUser | null => {
        if (!rawUser || typeof rawUser !== 'object') return null;

        const candidate = rawUser as Record<string, unknown>;
        const id = Number(candidate.id);
        const rol = Number(candidate.rol);
        const email =
            typeof candidate.email === 'string' ? candidate.email.trim() : '';
        const roleName = getCanonicalRoleName(candidate.role_name);

        if (!Number.isInteger(id) || id <= 0) return null;
        if (!Number.isInteger(rol) || rol <= 0) return null;
        if (!email) return null;

        return {
            id,
            email,
            rol,
            role_name: roleName,
        };
    };

    const persistToken = (nextToken: string | null) => {
        if (nextToken) {
            window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
        } else {
            window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        }

        setToken(nextToken);
    };

    const syncSession = async (nextToken?: string | null) => {
        if (nextToken !== undefined) {
            persistToken(nextToken);
        }

        try {
            const response = await api.get('/auth/session');
            setUser(normalizeUser(response.data?.user));
        } catch {
            setUser(null);
            persistToken(null);
        }
    };

    useEffect(() => {
        const bootstrapSession = async () => {
            const savedToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
            setToken(savedToken);
            await syncSession();
            setIsLoading(false);
        };

        void bootstrapSession();
    }, []);

    const login = async (nextToken?: string | null) => {
        await syncSession(nextToken);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Limpiamos el estado local incluso si la limpieza remota falla.
        }

        setUser(null);
        persistToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!user,
                user,
                isAdmin: isAdminRole(user?.role_name),
                token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
