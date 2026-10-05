// erreur.ts : transforme une erreur d'appel à l'API en message lisible pour l'utilisateur.
// Utilisé par toutes les pages du back office (gestion de la carte, cuisine...).
import axios from "axios";

export const messageErreur = (e: unknown): string => {
    // Pas de réponse du tout : API éteinte, réseau coupé, ngrok arrêté...
    if (!axios.isAxiosError(e) || !e.response) return "Serveur injoignable. Veuillez réessayer.";

    switch (e.response.status) {
        case 401:
            return "Session expirée : reconnectez-vous.";
        case 403:
            return "Vous n'avez pas les droits pour cette action.";
        case 404:
            return "Élément introuvable.";
        case 422:
            // 422 : detail est une liste d'erreurs Pydantic, pas un texte affichable tel quel
            return "Données invalides : vérifiez les champs du formulaire.";
        default: {
            // 400 et autres : l'API explique la raison dans detail (ex : produit déjà commandé)
            const detail = e.response.data?.detail;
            return typeof detail === "string" ? detail : "L'action a échoué. Veuillez réessayer.";
        }
    }
};