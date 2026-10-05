// Même règle que l'API : du texte, un @, du texte, un point, du texte, sans espace
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);
