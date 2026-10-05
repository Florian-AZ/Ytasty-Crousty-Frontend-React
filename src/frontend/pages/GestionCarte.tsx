// GestionCarte.tsx : page de gestion de la carte, ouverte depuis le back office.
// Staff : switch de disponibilité des produits de son restaurant (rupture d'ingrédient en cuisine).
// Admin : en plus, création, modification et suppression des produits de n'importe quel restaurant.
// La direction n'a pas accès à cette page (route protégée : admin et staff uniquement).
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    Alert, Avatar, Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Paper,
    Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

import ProduitFormDialog from "../components/FormProduitDialog.tsx";
import {api} from "../services/api";
import {formatPrix} from "../utils/format";
import {messageErreur} from "../utils/erreur";
import type {Product} from "../types/produit";
import type {RootState} from "../store/store";

function GestionCarte() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.userLogged.userLogged);
    const restaurants = useSelector((state: RootState) => state.restaurants.restaurants);

    const estAdmin = user?.role === "admin";
    const estStaff = user?.role === "staff";

    // Même logique que le tableau de bord cuisine :
    // staff = son restaurant, imposé ; admin = restaurant choisi, ou le premier par défaut
    const [choix, setChoix] = useState<number | "">("");
    const restaurantId = estStaff ? user?.restaurant_id : choix || restaurants[0]?.id;

    const [produits, setProduits] = useState<Product[]>([]);
    const [chargement, setChargement] = useState(true);
    const [message, setMessage] = useState("");
    // Formulaire : null = fermé, "nouveau" = création, un produit = modification de ce produit
    const [formulaire, setFormulaire] = useState<Product | "nouveau" | null>(null);
    // Produit en attente de confirmation de suppression (null = fenêtre fermée)
    const [aSupprimer, setASupprimer] = useState<Product | null>(null);

    // Chargement des produits du restaurant affiché (disponibles et en rupture)
    useEffect(() => {
        if (!restaurantId) return;
        let annule = false; // évite d'afficher une réponse arrivée après un changement de restaurant

        const charger = async () => {
            setChargement(true);
            try {
                // params : axios construit l'URL /products?restaurant_id=1
                const response = await api.get<Product[]>("/products", {params: {restaurant_id: restaurantId}});
                if (!annule) setProduits(response.data);
            } catch (e) {
                if (!annule) setMessage(messageErreur(e));
            } finally {
                if (!annule) setChargement(false);
            }
        };

        charger();
        return () => {
            annule = true;
        };
    }, [restaurantId]);

    // Remplace un produit de la liste par sa nouvelle version renvoyée par l'API
    const remplacer = (maj: Product) => setProduits((liste) => liste.map((p) => (p.id === maj.id ? maj : p)));

    // Switch : passe le produit de disponible à rupture, ou l'inverse
    async function changerDisponibilite(produit: Product) {
        try {
            const response = await api.patch<Product>(`/products/${produit.id}/availability`, {
                is_available: !produit.is_available,
            });
            remplacer(response.data);
        } catch (e) {
            setMessage(messageErreur(e));
        }
    }

    // Appelée par le formulaire une fois le produit enregistré par l'API
    function apresEnregistrement(sauve: Product) {
        if (formulaire !== "nouveau") {
            remplacer(sauve); // modification
        } else if (sauve.restaurant_id === restaurantId) {
            setProduits((liste) => [...liste, sauve]); // création dans le restaurant affiché : ajout en bas
        } else {
            setChoix(sauve.restaurant_id); // création ailleurs : on affiche ce restaurant (rechargement auto)
        }
        setFormulaire(null);
    }

    // Bouton "Supprimer" de la fenêtre de confirmation
    async function confirmerSuppression() {
        if (!aSupprimer) return;
        try {
            await api.delete(`/products/${aSupprimer.id}`);
            setProduits((liste) => liste.filter((p) => p.id !== aSupprimer.id));
        } catch (e) {
            // 400 : produit déjà commandé, l'API refuse pour garder l'historique -> le passer en rupture
            setMessage(messageErreur(e));
        } finally {
            setASupprimer(null);
        }
    }

    // Catégories déjà utilisées, sans doublon (new Set retire les doublons), proposées dans le formulaire
    const categories = [...new Set(produits.map((p) => p.category))];
    const nbRuptures = produits.filter((p) => !p.is_available).length;

    if (estStaff && !user?.restaurant_id) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Alert severity="warning">Aucun restaurant n'est rattaché à votre compte.</Alert>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Stack spacing={3}>
                    {/* "/backoffice" : à adapter si ta route du back office a un autre chemin */}
                    <Box>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate("/back-office")}>
                            Retour au back office
                        </Button>
                    </Box>

                    {/* En-tête : titre + résumé à gauche, restaurant et bouton de création à droite */}
                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={2}
                        sx={{justifyContent: "space-between", alignItems: {xs: "stretch", md: "center"}}}
                    >
                        <Box>
                            <Typography variant="h4" component="h1" sx={{fontWeight: 700}}>
                                Gestion de la carte
                            </Typography>
                            <Typography sx={{color: "text.secondary"}}>
                                {produits.length} produit(s) · {nbRuptures} en rupture
                            </Typography>
                        </Box>

                        <Stack direction={{xs: "column", sm: "row"}} spacing={2} sx={{alignItems: {sm: "center"}}}>
                            {estStaff ? (
                                <Chip
                                    color="primary"
                                    label={restaurants.find((r) => r.id === restaurantId)?.name ?? `Restaurant #${restaurantId}`}
                                />
                            ) : (
                                <FormControl size="small" sx={{minWidth: 240}}>
                                    <InputLabel id="carte-restaurant-label">Restaurant</InputLabel>
                                    <Select
                                        labelId="carte-restaurant-label"
                                        label="Restaurant"
                                        value={restaurantId ?? ""}
                                        onChange={(e) => setChoix(Number(e.target.value))}
                                    >
                                        {restaurants.map((r) => (
                                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {estAdmin && (
                                <Button variant="contained" startIcon={<AddIcon/>}
                                        onClick={() => setFormulaire("nouveau")}>
                                    Nouveau produit
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    {estStaff && (
                        <Alert severity="info">
                            Rupture d'ingrédient ? Désactivez le produit : il ne pourra plus être commandé.
                        </Alert>
                    )}
                    {message && <Alert severity="error" onClose={() => setMessage("")}>{message}</Alert>}

                    {/* Tableau des produits ; TableContainer : défilement horizontal si l'écran est trop étroit */}
                    <Paper variant="outlined">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produit</TableCell>
                                        <TableCell>Catégorie</TableCell>
                                        <TableCell align="right">Prix</TableCell>
                                        <TableCell>Disponibilité</TableCell>
                                        {estAdmin && <TableCell align="right">Actions</TableCell>}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {/* colSpan : une seule cellule qui prend la largeur de toutes les colonnes */}
                                    {chargement && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <CircularProgress size={28}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!chargement && produits.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{color: "text.secondary"}}>
                                                Aucun produit dans ce restaurant
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!chargement &&
                                        produits.map((p) => (
                                            <TableRow key={p.id} hover>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
                                                        {/* Avatar : affiche l'icône si l'image ne charge pas */}
                                                        <Avatar variant="rounded" src={p.image} alt={p.name}
                                                                sx={{width: 48, height: 48}}>
                                                            <FastfoodIcon/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{fontWeight: 600}}>{p.name}</Typography>
                                                            {/* Les ingrédients : utile au staff pour repérer ce qui est touché par une rupture */}
                                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                                {p.ingredients.join(", ")}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={p.category}/>
                                                </TableCell>
                                                <TableCell align="right">{formatPrix(p.price)}</TableCell>
                                                <TableCell>
                                                    {/* FormControlLabel : associe un texte cliquable au switch */}
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={p.is_available}
                                                                onChange={() => changerDisponibilite(p)}
                                                                color="success"
                                                            />
                                                        }
                                                        label={p.is_available ? "Disponible" : "Rupture"}
                                                        sx={{color: p.is_available ? "success.main" : "error.main"}}
                                                    />
                                                </TableCell>
                                                {estAdmin && (
                                                    <TableCell align="right" sx={{whiteSpace: "nowrap"}}>
                                                        {/* Tooltip : bulle d'aide au survol, utile pour un bouton qui n'a qu'une icône */}
                                                        <Tooltip title="Modifier">
                                                            <IconButton onClick={() => setFormulaire(p)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer">
                                                            <IconButton color="error" onClick={() => setASupprimer(p)}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Stack>

                {/* Formulaire affiché seulement quand il est ouvert : il repart de zéro à chaque ouverture */}
                {formulaire && restaurantId && (
                    <ProduitFormDialog
                        produit={formulaire === "nouveau" ? null : formulaire}
                        restaurantId={restaurantId}
                        categories={categories}
                        onClose={() => setFormulaire(null)}
                        onSaved={apresEnregistrement}
                    />
                )}

                {/* Confirmation avant suppression : l'action est définitive */}
                <Dialog open={aSupprimer !== null} onClose={() => setASupprimer(null)}>
                    <DialogTitle>Supprimer « {aSupprimer?.name} » ?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Le produit sera retiré de la carte. Pour un arrêt temporaire, préférez le passer en rupture.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setASupprimer(null)}>Retour</Button>
                        <Button color="error" variant="contained" onClick={confirmerSuppression}>
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}

export default GestionCarte;