/* Define estructura del contexto los datos que se compartiran - SOLO types (Vite OK) */

import { createContext } from 'react';
import type { CanonicalRoleName } from '../utils/roles';

export interface JWTPayload {
    id: number;
    email: string;
    rol: number;
    role_name?: CanonicalRoleName | null;
    exp?: number;
}

export type AuthUser = JWTPayload;

export interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: JWTPayload | null;
    isAdmin: boolean;
    token: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);
