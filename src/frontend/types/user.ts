// user.ts : types liés aux utilisateurs (comptes du personnel).
export type Role = "admin" | "staff" | "direction";

// Utilisateur tel que renvoyé par l'API (POST /users, GET /users, GET /users/{id})
// ? : champ facultatif, il peut être absent de l'objet.
// Absents quand l'utilisateur vient du token (le JWT ne contient que username, role et restaurant_id),
// présents quand il vient de l'API (GET /users).
export interface User {
    id?: number;
    first_name?: string;
    last_name?: string;
    username: string;
    role: Role;
    restaurant_id: number | null; // null pour admin et direction, obligatoire pour un staff
}