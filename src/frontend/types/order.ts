export interface OrderItem {
    quantity :  number,
    prix_fige_commande : number,
    product_id : number
}
export interface Order {
    id : number,
    order_number : string,
    created_at : string,
    total_price : number,
    status : string,
    pickup_mode : string,
    customer_name : string,
    customer_email : string,
    restaurant_id : number,
    order_items : OrderItem[],
}