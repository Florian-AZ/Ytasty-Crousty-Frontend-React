// user.ts : types liés aux utilisateurs (comptes du personnel).
export type Role = "admin" | "staff" | "direction";

// Utilisateur tel que renvoyé par l'API (POST /users, GET /users, GET /users/{id})
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    role: Role;
    restaurant_id: number | null; // null pour admin et direction, obligatoire pour un staff
}