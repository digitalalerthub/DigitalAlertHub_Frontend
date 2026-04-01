import { useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import type { AuthUser } from './AuthContext';
import { getCanonicalRoleName, isAdminRole } from '../utils/roles';

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

    const syncSession = async () => {
        try {
            const response = await api.get('/auth/session');
            setUser(normalizeUser(response.data?.user));
            setToken(null);
        } catch {
            setUser(null);
            setToken(null);
        }
    };

    useEffect(() => {
        const bootstrapSession = async () => {
            await syncSession();
            setIsLoading(false);
        };

        void bootstrapSession();
    }, []);

    const login = async () => {
        await syncSession();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Limpiamos el estado local incluso si la limpieza remota falla.
        }

        setUser(null);
        setToken(null);
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
