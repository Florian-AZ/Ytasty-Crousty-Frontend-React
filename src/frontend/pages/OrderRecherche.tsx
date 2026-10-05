// Page de recherche d'une commande : le client saisit son numéro de suivi, puis est redirigé vers OrderSuivi
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { isValidOrderNumber } from "../utils/validation.ts";

function OrderRecherche() {
    const navigate = useNavigate();
    const [orderNumber, setOrderNumber] = useState("");

    // trim : retire les espaces en trop (fréquent quand on colle un numéro copié)
    const numero = orderNumber.trim();
    const numeroValide = isValidOrderNumber(numero);

    function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault(); // empêche le rechargement de la page par le formulaire
        if (!numeroValide) return;
        navigate(`/order/${numero}`);
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            {/* Même bloc encadré que la page de suivi */}
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
                {/* Un vrai formulaire : la touche Entrée valide aussi la saisie */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                        {/* En-tête centré : icône, surtitre, titre, explication */}
                        <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}>
                            <ReceiptLongIcon color="primary" sx={{ fontSize: 48 }} />
                            <Typography variant="overline" sx={{ color: "text.secondary" }}>
                                Suivi de commande
                            </Typography>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                Où en est ma commande ?
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Saisissez le numéro reçu lors de votre commande.
                            </Typography>
                        </Stack>

                        <TextField
                            label="Numéro de commande"
                            placeholder="YC-XXXXXXXX"
                            value={orderNumber}
                            // toUpperCase : "yc-abc..." devient "YC-ABC...", pour ne pas bloquer le client sur une minuscule
                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                            helperText="Format : YC-XXXXXXXX"
                            fullWidth
                            autoFocus
                            // Même police que le numéro affiché sur la page de suivi, plus grande et espacée
                            sx={{ "& input": { fontFamily: "monospace", fontSize: "1.25rem", letterSpacing: "0.1em" } }}
                            // Coche verte dans le champ dès que le format est correct
                            slotProps={{
                                input: {
                                    endAdornment: numeroValide ? (
                                        <InputAdornment position="end">
                                            <CheckCircleIcon color="success" />
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<SearchIcon />}
                            disabled={!numeroValide}
                        >
                            Suivre ma commande
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default OrderRecherche;