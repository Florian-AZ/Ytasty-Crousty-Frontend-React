import { type SyntheticEvent, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store.ts";
import { setUserLogged } from "../store/reducers/userLogged.ts";
import { api } from "../services/api";
import { persistToken, userFromToken, validatePassword, validateUsername, type TokenResponse, } from "../services/auth";

function Connexion() {
    const [username, setUsername] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");

        const nextUsernameError = validateUsername(username);
        const nextPasswordError = validatePassword(mdp);

        setUsernameError(nextUsernameError);
        setPasswordError(nextPasswordError);

        if (nextUsernameError || nextPasswordError) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post<TokenResponse>("/auth/login", {
                username,
                password: mdp,
            });

            persistToken(response.data.access_token);

            const authenticatedUser = userFromToken(response.data.access_token);

            if (!authenticatedUser) {
                throw new Error("Le token reçu est invalide.");
            }

            dispatch(setUserLogged(authenticatedUser));
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 401) {
                setMessage("Identifiants incorrects.");
            } else if (axios.isAxiosError(e) && !e.response) {
                setMessage("L’API est inaccessible. Vérifiez que le backend est lancé.");
            } else {
                setMessage("La connexion a échoué. Veuillez réessayer.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Box
            component="main"
            sx={(theme) => ({
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2.5,
                pt: { xs: 14, sm: 15 },
                pb: 4,
                bgcolor: theme.palette.mode === "dark" ? "#121318" : "background.default",
            })}
        >
            <Box
                component="section"
                sx={(theme) => ({
                    width: "100%",
                    maxWidth: 532,
                    minHeight: { sm: 455 },
                    border: "1px solid",
                    borderColor: theme.palette.mode === "dark" ? "#30323D" : "divider",
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === "dark" ? "#15161C" : "background.paper",
                    px: { xs: 3, sm: 5 },
                    py: { xs: 4, sm: 4.5 },
                })}
            >
                <Typography
                    component="h1"
                    variant="h2"
                    sx={{ textAlign: "center", mb: { xs: 4, sm: 4.5 } }}
                >
                    Connexion
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                    <Box>
                        <Typography
                            component="label"
                            htmlFor="username"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1, fontSize: "1.05rem" }}
                        >
                            Nom d&apos;utilisateur :
                        </Typography>

                        <TextField
                            id="username"
                            name="username"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);
                                setUsernameError("");
                            }}
                            autoComplete="username"
                            error={Boolean(usernameError)}
                            helperText={usernameError}
                            slotProps={{
                                htmlInput: { "aria-label": "Nom d'utilisateur" },
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            component="label"
                            htmlFor="password"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1, fontSize: "1.05rem" }}
                        >
                            Mot de passe :
                        </Typography>

                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            value={mdp}
                            onChange={(event) => {
                                setMdp(event.target.value);
                                setPasswordError("");
                            }}
                            autoComplete="current-password"
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                            slotProps={{
                                htmlInput: { "aria-label": "Mot de passe" },
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!username || !mdp || isSubmitting}
                        sx={{ mt: 0.75, minHeight: 48 }}
                    >
                        {isSubmitting ? "Connexion en cours..." : "Connexion"}
                    </Button>

                    {message && <Alert severity="error">{message}</Alert>}
                </Box>
            </Box>
        </Box>
    );
}

export default Connexion;
