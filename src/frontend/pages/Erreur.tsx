import { Link, useParams } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";

const erreurs: Record<number, { titre: string; message: string }> = {
    401: {
        titre: "Connexion nécessaire",
        message: "Connecte-toi pour accéder à cette page.",
    },
    403: {
        titre: "Accès interdit",
        message: "Tu n'as pas les droits nécessaires pour accéder à cette page.",
    },
    404: {
        titre: "Page introuvable",
        message: "La page demandée n'existe pas.",
    },
    500: {
        titre: "Erreur serveur",
        message: "Une erreur est survenue. Réessaie plus tard.",
    },
};

export default function Erreur() {
    const { code } = useParams();
    const numero = Number(code);
    const codeErreur = erreurs[numero] ? numero : 404;
    const erreur = erreurs[codeErreur];

    return (
        <Container sx={{ pt: 16, pb: 6 }}>
            <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
                <Typography variant="h1">{codeErreur}</Typography>
                <Typography variant="h4">{erreur.titre}</Typography>
                <Typography>{erreur.message}</Typography>

                <Button component={Link} to="/" variant="contained">
                    Retour à l'accueil
                </Button>
            </Stack>
        </Container>
    );
}