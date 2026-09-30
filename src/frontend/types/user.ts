export type Role = "admin" | "staff" | "direction";

export interface User {
    id: number | null,
    first_name: string | null,
    last_name: string | null,
    username: string | null,
    role: Role | null,
    restaurant_id: number | null
}
