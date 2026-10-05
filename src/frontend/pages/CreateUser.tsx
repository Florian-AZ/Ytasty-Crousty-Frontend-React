import { useState, type SyntheticEvent } from "react";
import { Alert, Box, Button, Card, CardContent, Container, MenuItem, Stack, TextField, Typography, } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "../services/api";
import { validatePassword, validateUsername } from "../services/auth";
import type { RootState } from "../store/store";
import type { Role, User } from "../types/user";


interface FormState {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    role: Role;
    restaurant_id: string;
}

const initialForm: FormState = {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role: "staff",
    restaurant_id: "",
};

export default function CreateUser() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const restaurants = useSelector(
        (state: RootState) => state.restaurants.restaurants,
    );

    function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const usernameError = validateUsername(form.username);
        const passwordError = validatePassword(form.password);

        if (!form.first_name.trim() || !form.last_name.trim()) {
            setError("Le prénom et le nom sont obligatoires.");
            return;
        }

        if (usernameError || passwordError) {
            setError(usernameError || passwordError);
            return;
        }

        if (form.role === "staff" && !form.restaurant_id) {
            setError("Un compte staff doit être rattaché à un restaurant.");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post<User>("/users", {
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                username: form.username,
                password: form.password,
                role: form.role,
                restaurant_id:
                    form.role === "staff" ? Number(form.restaurant_id) : null,
            });

            setSuccess(`Le compte ${response.data.username} a été créé.`);
            setForm(initialForm);
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const detail = requestError.response?.data?.detail;
                setError(typeof detail === "string" ? detail : "Création impossible.");
            } else {
                setError("Création impossible.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", pt: 16, pb: 6 }}>
            <Container maxWidth="sm">
                <Card>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        <Typography variant="h2" sx={{ mb: 1 }}>
                            Créer un utilisateur
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Cette action est réservée aux administrateurs.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Prénom"
                                    value={form.first_name}
                                    onChange={(event) => updateField("first_name", event.target.value)}
                                />
                                <TextField
                                    label="Nom"
                                    value={form.last_name}
                                    onChange={(event) => updateField("last_name", event.target.value)}
                                />
                                <TextField
                                    label="Nom d’utilisateur"
                                    value={form.username}
                                    onChange={(event) => updateField("username", event.target.value)}
                                    helperText="8 à 12 caractères alphanumériques"
                                />
                                <TextField
                                    label="Mot de passe"
                                    type="password"
                                    value={form.password}
                                    onChange={(event) => updateField("password", event.target.value)}
                                    helperText="12 à 64 caractères, avec majuscule, chiffre et caractère spécial"
                                />
                                <TextField
                                    select
                                    label="Rôle"
                                    value={form.role}
                                    onChange={(event) => {
                                        const role = event.target.value as Role;
                                        setForm((current) => ({
                                            ...current,
                                            role,
                                            restaurant_id:
                                                role === "staff" ? current.restaurant_id : "",
                                        }));
                                        setError("");
                                        setSuccess("");
                                    }}
                                >
                                    <MenuItem value="staff">Staff</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="direction">Direction</MenuItem>
                                </TextField>

                                {form.role === "staff" && (
                                    <TextField
                                        select
                                        label="Restaurant"
                                        value={form.restaurant_id}
                                        onChange={(event) => updateField("restaurant_id", event.target.value)}
                                        disabled={restaurants.length === 0}
                                        helperText={
                                            restaurants.length === 0
                                                ? "Aucun restaurant disponible."
                                                : "Choisissez le restaurant auquel rattacher ce compte."
                                        }
                                    >
                                        <MenuItem value="" disabled>
                                            Sélectionnez un restaurant
                                        </MenuItem>

                                        {restaurants.map((restaurant) => (
                                            <MenuItem key={restaurant.id ?? restaurant.name} value={restaurant.id ?? ""}>
                                                {restaurant.name} — {restaurant.city}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}

                                {error && <Alert severity="error">{error}</Alert>}
                                {success && <Alert severity="success">{success}</Alert>}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Création en cours..." : "Créer le compte"}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
