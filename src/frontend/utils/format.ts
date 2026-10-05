// format.ts : fonctions de formatage réutilisables pour l'affichage (prix en euros, dates de commande).
// Fonctions simples sans React : elles prennent une valeur brute de l'API et renvoient un texte lisible.

// Formate un prix en euros, à la française : virgule décimale, deux décimales, symbole € après le montant.
// Intl.NumberFormat : outil intégré au navigateur pour formater des nombres selon une langue et un pays
// "fr-FR" : règles françaises ; style "currency" + currency "EUR" : affichage en monnaie, en euros
// 9.9 -> "9,90 €"
export const formatPrix = (prix: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);

// Formate une date reçue de l'API en date et heure françaises, dans le fuseau horaire du navigateur.
// new Date(iso) : transforme le texte ISO reçu en vraie date JavaScript (le "Z" final indique l'UTC)
// Intl.DateTimeFormat : équivalent de Intl.NumberFormat pour les dates
// dateStyle "short" : 05/10/2026 ; timeStyle "short" : 13:38 (sans les secondes)
// "2026-10-05T11:38:04Z" (date ISO renvoyée par l'API, en UTC) -> "05/10/2026 13:38" (heure locale)
export const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));