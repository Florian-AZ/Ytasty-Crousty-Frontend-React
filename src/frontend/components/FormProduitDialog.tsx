// FormProduitDialog.tsx : fenêtre de formulaire pour créer ou modifier un produit (réservée à l'admin).
// produit = null -> création (POST /products) ; sinon modification (PATCH /products/{id}).
// La page ne l'affiche que lorsqu'elle est ouverte : les champs repartent donc de zéro à chaque ouverture.
import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Alert, Autocomplete, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import { api } from "../services/api";
import { messageErreur } from "../utils/erreur";
import type { Product } from "../types/produit";
import type { RootState } from "../store/store";

interface ProduitFormDialogProps {
    produit: Product | null; // null = création
    restaurantId: number; // restaurant proposé par défaut à la création
    categories: string[]; // catégories déjà utilisées, proposées dans la liste
    // Fonctions fournies par la page parente, que le formulaire appelle pour la prévenir (callbacks) :
    // onClose : fermeture demandée (Annuler, clic à côté) -> la page ferme la fenêtre
    onClose: () => void;
    // onSaved : produit enregistré -> la page reçoit le produit renvoyé par l'API et met à jour son tableau
    onSaved: (produit: Product) => void;
}

// Valeurs des champs du formulaire : du texte (ce que contient un TextField), converti au moment de l'envoi
interface Champs {
    restaurant_id: number;
    name: string;
    description: string;
    category: string;
    price: string;
    ingredients: string;
    image: string;
}

// Formulaire de produit, utilisé pour la création ET la modification :
// - produit = null : champs vides, envoi en POST /products avec le restaurant choisi ;
// - produit fourni : champs pré-remplis, envoi en PATCH /products/{id} (restaurant non modifiable).
// Le formulaire ne touche pas aux données de la page : une fois l'API d'accord, il lui transmet
// le produit enregistré via onSaved ; en cas d'erreur, il affiche le message et reste ouvert.
function ProduitFormDialog({ produit, restaurantId, categories, onClose, onSaved }: ProduitFormDialogProps) {
    const restaurants = useSelector((state: RootState) => state.restaurants.restaurants);

    // Pré-rempli avec le produit en modification, vide en création
    const [champs, setChamps] = useState<Champs>({
        restaurant_id: produit?.restaurant_id ?? restaurantId,
        name: produit?.name ?? "",
        description: produit?.description ?? "",
        category: produit?.category ?? "",
        price: produit ? String(produit.price) : "",
        // join(", ") : ["pain", "poulet"] -> "pain, poulet" (un TextField ne contient que du texte)
        ingredients: produit?.ingredients.join(", ") ?? "",
        image: produit?.image ?? "",
    });
    const [message, setMessage] = useState("");
    const [envoi, setEnvoi] = useState(false); // désactive le bouton pendant l'appel (évite le double clic)

    // replace : accepte la virgule française (9,90 -> 9.90)
    const prix = Number(champs.price.replace(",", "."));
    const prixValide = prix > 0; // Number("abc") donne NaN, et NaN > 0 est faux
    const formulaireValide = champs.name.trim() !== "" && champs.category.trim() !== "" && prixValide;

    async function enregistrer() {
        const body = {
            name: champs.name.trim(),
            description: champs.description.trim(),
            category: champs.category.trim(),
            price: prix,
            image: champs.image.trim(),
            // "pain, poulet, sauce" -> ["pain", "poulet", "sauce"] (les morceaux vides sont retirés)
            ingredients: champs.ingredients.split(",").map((i) => i.trim()).filter((i) => i !== ""),
        };

        setEnvoi(true);
        setMessage("");
        try {
            // Modification : PATCH sans restaurant_id (l'API ne permet pas de changer un produit de restaurant)
            // Création : POST avec le restaurant choisi, produit disponible par défaut
            const response = produit
                ? await api.patch<Product>(`/products/${produit.id}`, body)
                : await api.post<Product>("/products", { ...body, restaurant_id: champs.restaurant_id, is_available: true });
            onSaved(response.data);
        } catch (e) {
            setMessage(messageErreur(e));
        } finally {
            setEnvoi(false);
        }
    }

    return (
        // fullWidth + maxWidth="sm" : la fenêtre prend toute la largeur disponible, jusqu'à 600 px
        // open : toujours ouverte, c'est la page qui décide d'afficher ou non ce composant.
        // onClose : appelée par MUI (clic à côté, touche Échap) -> la page retire le formulaire,
        // son state est détruit, donc les champs repartent de zéro à la prochaine ouverture.
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{produit ? `Modifier « ${produit.name} »` : "Nouveau produit"}</DialogTitle>

            <DialogContent>
                {/* pt : sans cet espace, le label du premier champ est coupé par le titre */}
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {message && <Alert severity="error">{message}</Alert>}

                    {/* Restaurant : modifiable seulement à la création */}
                    <FormControl fullWidth disabled={produit !== null}>
                        <InputLabel id="produit-restaurant-label">Restaurant</InputLabel>
                        <Select
                            labelId="produit-restaurant-label"
                            label="Restaurant"
                            value={champs.restaurant_id}
                            onChange={(e) => setChamps({ ...champs, restaurant_id: Number(e.target.value) })}
                        >
                            {restaurants.map((r) => (
                                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Nom"
                        required
                        value={champs.name}
                        onChange={(e) => setChamps({ ...champs, name: e.target.value })}
                    />

                    <TextField
                        label="Description"
                        multiline
                        minRows={2}
                        value={champs.description}
                        onChange={(e) => setChamps({ ...champs, description: e.target.value })}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {/* Autocomplete freeSolo : propose les catégories existantes, mais accepte une nouvelle valeur */}
                        <Autocomplete
                            freeSolo
                            options={categories}
                            inputValue={champs.category}
                            onInputChange={(_, valeur) => setChamps({ ...champs, category: valeur })}
                            sx={{ flex: 1 }}
                            renderInput={(params) => <TextField {...params} label="Catégorie" required />}
                        />

                        <TextField
                            label="Prix"
                            required
                            value={champs.price}
                            onChange={(e) => setChamps({ ...champs, price: e.target.value })}
                            // Rouge seulement si quelque chose a été tapé et que ce n'est pas un prix valide
                            error={champs.price !== "" && !prixValide}
                            helperText={champs.price !== "" && !prixValide ? "Prix supérieur à 0 attendu" : " "}
                            sx={{ flex: 1 }}
                            slotProps={{
                                input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
                                // inputMode decimal : clavier numérique sur mobile et tablette
                                htmlInput: { inputMode: "decimal" },
                            }}
                        />
                    </Stack>

                    <TextField
                        label="Ingrédients"
                        helperText="Séparés par des virgules : pain, poulet, sauce"
                        value={champs.ingredients}
                        onChange={(e) => setChamps({ ...champs, ingredients: e.target.value })}
                    />

                    {/* Image : lien saisi + aperçu (l'icône s'affiche si le lien est vide ou cassé) */}
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Avatar variant="rounded" src={champs.image || undefined} sx={{ width: 64, height: 64 }}>
                            <ImageIcon />
                        </Avatar>
                        <TextField
                            label="Image"
                            fullWidth
                            helperText="Lien https://... ou chemin /images/... (dossier public)"
                            value={champs.image}
                            onChange={(e) => setChamps({ ...champs, image: e.target.value })}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Annuler</Button>
                <Button variant="contained" disabled={!formulaireValide || envoi} onClick={enregistrer}>
                    {produit ? "Enregistrer" : "Créer le produit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProduitFormDialog;