// restaurant.ts : type d'un restaurant, tel que renvoyé par l'API (GET /restaurants, GET /restaurants/{id}).
// Tous les champs sont toujours présents : l'API ne renvoie jamais de valeur null pour un restaurant.
export interface Restaurant {
    id: number;
    name: string;
    city: string;
    address: string;
    is_open: boolean; // false = restaurant fermé, les commandes y sont refusées
    opening_hours: string; // texte libre, ex : "11h-23h"
    contact: string;
}