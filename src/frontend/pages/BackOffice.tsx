import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../store/store";
import { clearUserLogged } from "../store/reducers/userLogged";
import { clearStoredToken } from "../services/auth";

export default function BackOffice() {
    const user = useSelector((state: RootState) => state.userLogged.userLogged);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    function logout() {
        clearStoredToken();
        dispatch(clearUserLogged());
        navigate("/login", { replace: true });
    }

    return (
        <Box
            component="main"
            sx={{ minHeight: "100vh", bgcolor: "background.default", pt: 16, pb: 6 }}
        >
            <Container maxWidth="md">
                <Card>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h2">Espace sécurisé</Typography>
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    Connecté avec le compte {user?.username}.
                                </Typography>
                            </Box>

                            <Chip
                                color="secondary"
                                label={`Rôle : ${user?.role ?? "inconnu"}`}
                                sx={{ alignSelf: "flex-start" }}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                {user?.role === "admin" && (
                                    <Button
                                        component={Link}
                                        to="/back-office/users/new"
                                        variant="contained"
                                    >
                                        Créer un utilisateur
                                    </Button>
                                )}

                                <Button variant="outlined" color="primary" onClick={logout}>
                                    Se déconnecter
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
