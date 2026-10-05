// validation.ts : règles de validation des formulaires, partagées par toutes les pages.
// Chaque fonction renvoie true si la valeur saisie a le bon format, false sinon.
// Ces vérifications servent au confort de l'utilisateur : l'API refait toujours ses propres contrôles.

// Expression régulière (regex) : un motif que le texte doit respecter, écrit entre deux /
// Même règle que l'API : du texte, un @, du texte, un point, du texte, sans espace
// ^ et $ : début et fin du texte (tout le texte doit correspondre, pas seulement une partie)
// [^@\s]+ : un ou plusieurs caractères qui ne sont ni un @ ni un espace
// \. : un vrai point (un . seul voudrait dire "n'importe quel caractère")
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// .test(texte) : renvoie true si le texte respecte le motif
// "client@example.com" -> true ; "client@example" -> false
export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

// Format des numéros de commande générés par l'API : "YC-" puis 8 majuscules ou chiffres
// [A-Z0-9] : une lettre majuscule ou un chiffre ; {8} : exactement 8 fois
const ORDER_NUMBER_REGEX = /^YC-[A-Z0-9]{8}$/;

// "YC-S2YLBZJ6" -> true ; "YC-S2YL" (trop court) ou "yc-s2ylbzj6" (minuscules) -> false
export const isValidOrderNumber = (orderNumber: string) => ORDER_NUMBER_REGEX.test(orderNumber);