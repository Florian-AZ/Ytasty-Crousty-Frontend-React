import type { Role, User } from "../types/user";

export const ACCESS_TOKEN_KEY = "access_token";

export interface TokenResponse {
    access_token: string;
    token_type: "bearer";
}

interface JwtPayload {
    sub?: string;
    role?: string;
    exp?: number;
}

const roles: Role[] = ["admin", "staff", "direction"];

function isRole(value: string | undefined): value is Role {
    return roles.some((role) => role === value);
}

function decodePayload(token: string): JwtPayload | null {
    try {
        const encodedPayload = token.split(".")[1];

        if (!encodedPayload) {
            return null;
        }

        const base64 = encodedPayload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");

        return JSON.parse(atob(base64)) as JwtPayload;
    } catch {
        return null;
    }
}

export function userFromToken(token: string): User | null {
    const payload = decodePayload(token);

    if (
        !payload?.sub ||
        !isRole(payload.role) ||
        !payload.exp ||
        payload.exp <= Date.now() / 1000
    ) {
        return null;
    }

    return {
        id: null,
        first_name: null,
        last_name: null,
        username: payload.sub,
        role: payload.role,
        restaurant_id: null,
    };
}

export function persistToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("accesstoken");
}

export function restoreAuthenticatedUser(): User | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
        return null;
    }

    const user = userFromToken(token);

    if (!user) {
        clearStoredToken();
    }

    return user;
}

export function validateUsername(username: string): string {
    if (!/^[a-zA-Z0-9]{8,12}$/.test(username)) {
        return "8 à 12 caractères alphanumériques sont requis.";
    }

    return "";
}

export function validatePassword(password: string): string {
    if (password.length < 12 || password.length > 64) {
        return "Le mot de passe doit contenir entre 12 et 64 caractères.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Le mot de passe doit contenir une majuscule.";
    }

    if (!/[0-9]/.test(password)) {
        return "Le mot de passe doit contenir un chiffre.";
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Le mot de passe doit contenir un caractère spécial.";
    }

    return "";
}
