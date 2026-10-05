// 9.9 -> "9,90 €"
export const formatPrix = (prix: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
