// order.ts : types TypeScript d'une commande, tels que renvoyés par l'API
// (POST /orders, GET /orders/{order_number}, GET /restaurants/{id}/orders).
// Ils décrivent le JSON reçu, pas la table de la base de données : pas d'id,
// client imbriqué dans "customer", lignes de commande dans "items".

// Une ligne de la commande : un produit et sa quantité
export interface OrderItem {
    product_id: number;
    quantity: number;
    unit_price: number; // prix figé au moment de la commande (ne change pas si le prix du produit change ensuite)
}

export interface Order {
    order_number: string; // numéro de suivi public, au format "YC-XXXXXXXX"
    restaurant_id: number;
    created_at: string; // date ISO en UTC (ex : "2026-10-05T11:38:04Z"), à afficher avec formatDate
    items: OrderItem[]; // OrderItem[] : un tableau de lignes de commande
    total_price: number; // total calculé par le serveur, à partir des prix en base
    // Union de chaînes : status ne peut valoir QUE l'une de ces six valeurs, toute autre est refusée à la compilation
    status: "pending" | "validated" | "preparing" | "ready" | "collected" | "cancelled";
    pickup_mode: "onsite" | "takeaway"; // sur place ou à emporter
    // Objet imbriqué : le client est regroupé dans "customer" (order.customer.name)
    customer: {
        name: string;
        email: string;
    };
}