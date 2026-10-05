// Cuisine.tsx : tableau de bord cuisine du back office.
// Affiche les commandes en cours d'un restaurant en 3 colonnes (à traiter, en préparation, prêtes),
// avec des boutons pour faire avancer le statut en un clic ou annuler la commande.
// Staff : uniquement son restaurant. Admin et direction : choix du restaurant. Direction : lecture seule.
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    Alert, Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {api} from "../services/api.ts";
import type {Order} from "../types/order.ts";
import type {RootState} from "../store/store.ts";
import {messageErreur} from "../utils/erreur.ts";

// Order["status"] : réutilise le type du champ status d'une commande ("pending" | "validated" | ...)
type Statut = Order["status"];

// Au-delà de ce délai, une commande pas encore commencée est signalée en rouge
const SEUIL_ALERTE_MINUTES = 10;
// Rechargement automatique des commandes toutes les 15 secondes (en attendant Socket.io)
const RAFRAICHISSEMENT_MS = 15_000;

// Les 3 colonnes du tableau, et les statuts rangés dans chacune
const COLONNES: { titre: string; statuts: Statut[] }[] = [
    {titre: "À traiter", statuts: ["pending", "validated"]},
    {titre: "En préparation", statuts: ["preparing"]},
    {titre: "Prêtes", statuts: ["ready"]},
];

// Bouton d'action rapide pour chaque statut : son texte et le statut suivant
// Partial : tous les statuts n'ont pas d'action (une commande récupérée ou annulée ne bouge plus)
const ACTION_SUIVANTE: Partial<Record<Statut, { label: string; suivant: Statut }>> = {
    pending: {label: "Lancer la préparation", suivant: "preparing"},
    validated: {label: "Lancer la préparation", suivant: "preparing"},
    preparing: {label: "Marquer prête", suivant: "ready"},
    ready: {label: "Remise au client", suivant: "collected"},
};

// Minutes écoulées depuis la création de la commande (jamais négatif)
const minutesDepuis = (iso: string, maintenant: number) =>
    Math.max(0, Math.floor((maintenant - new Date(iso).getTime()) / 60_000));

function cuisine() {
    const user = useSelector((state: RootState) => state.userLogged.userLogged);
    const restaurants = useSelector((state: RootState) => state.restaurants.restaurants);
    const produits = useSelector((state: RootState) => state.products.products);

    const estStaff = user?.role === "staff";
    const lectureSeule = user?.role === "direction";

    // Restaurant choisi dans la liste déroulante (admin et direction uniquement)
    const [choix, setChoix] = useState<number | "">("");
    // Staff : son restaurant, imposé. Sinon : le restaurant choisi, ou le premier par défaut
    const restaurantId = estStaff ? user?.restaurant_id : choix || restaurants[0]?.id;

    const [orders, setOrders] = useState<Order[]>([]);
    const [message, setMessage] = useState("");
    // Heure du dernier chargement, pour calculer depuis combien de temps chaque commande attend
    const [maintenant, setMaintenant] = useState(() => Date.now());
    // Commande en attente de confirmation d'annulation (null = fenêtre fermée)
    const [aAnnuler, setAAnnuler] = useState<Order | null>(null);

    // Chargement des commandes du restaurant, puis rechargement régulier
    useEffect(() => {
        if (!restaurantId) return;
        let annule = false; // évite d'afficher une réponse arrivée après un changement de restaurant

        const charger = async () => {
            try {
                const response = await api.get<Order[]>(`/restaurants/${restaurantId}/orders`);
                if (annule) return;
                setOrders(response.data);
                setMaintenant(Date.now());
            } catch (e) {
                if (!annule) setMessage(messageErreur(e));
            }
        };

        charger();
        // setInterval : relance charger toutes les 15 secondes
        const intervalle = setInterval(charger, RAFRAICHISSEMENT_MS);

        // Nettoyage : à la fermeture de la page ou au changement de restaurant
        return () => {
            annule = true;
            clearInterval(intervalle);
        };
    }, [restaurantId]);

    // Remplace une commande de la liste par sa nouvelle version renvoyée par l'API (changement de statut, annulation).
    // setOrders reçoit une fonction : React lui passe la liste la plus récente, même si un rechargement vient d'avoir lieu.
    // map construit une NOUVELLE liste (sans modifier l'ancienne), pour que React détecte le changement et réaffiche :
    // la commande qui a le même numéro est remplacée par maj, toutes les autres sont gardées telles quelles.
    const mettreAJour = (maj: Order) =>
        setOrders((precedentes) => precedentes.map((o) => (o.order_number === maj.order_number ? maj : o)));

    // Bouton d'action rapide : passe la commande au statut suivant
    async function changerStatut(order: Order, statut: Statut) {
        try {
            const response = await api.patch<Order>(`/orders/${order.order_number}/status`, {status: statut});
            mettreAJour(response.data);
        } catch (e) {
            setMessage(messageErreur(e));
        }
    }

    // Bouton "Annuler la commande" de la fenêtre de confirmation
    async function confirmerAnnulation() {
        if (!aAnnuler) return;
        try {
            const response = await api.post<Order>(`/orders/${aAnnuler.order_number}/cancel`);
            mettreAJour(response.data);
        } catch (e) {
            setMessage(messageErreur(e));
        } finally {
            setAAnnuler(null);
        }
    }

    // Renvoie le nom d'un produit à partir de son id : les commandes ne contiennent que les ids des produits.
    // find cherche le produit correspondant dans la liste du store Redux (undefined s'il n'est pas trouvé).
    // ?.name : lit le nom seulement si le produit a été trouvé (sinon undefined, sans planter).
    // ?? : si le nom est introuvable (produits pas encore chargés, produit supprimé), affiche "Produit #12" à la place.
    const nomProduit = (id: number) => produits.find((p) => p.id === id)?.name ?? `Produit #${id}`;

    // Staff sans restaurant : rien à afficher
    if (estStaff && !user?.restaurant_id) {
        return <Alert severity="warning">Aucun restaurant n'est rattaché à votre compte.</Alert>;
    }

    return (
        <Stack spacing={3}>
            {/* En-tête : titre, et restaurant (imposé pour le staff, au choix pour admin et direction) */}
            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                sx={{justifyContent: "space-between", alignItems: {xs: "stretch", sm: "center"}}}
            >
                <Typography variant="h4" component="h2" sx={{fontWeight: 700}}>
                    Tableau de bord cuisine
                </Typography>

                {estStaff ? (
                    <Chip
                        color="primary"
                        label={restaurants.find((r) => r.id === restaurantId)?.name ?? `Restaurant #${restaurantId}`}
                    />
                ) : (
                    <FormControl size="small" sx={{minWidth: 240}}>
                        <InputLabel id="cuisine-restaurant-label">Restaurant</InputLabel>
                        <Select
                            labelId="cuisine-restaurant-label"
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
            </Stack>

            {lectureSeule && (
                <Alert severity="info">Mode lecture seule : la direction consulte les commandes sans les
                    modifier.</Alert>
            )}
            {/* onClose : ajoute une croix pour fermer le message */}
            {message && <Alert severity="error" onClose={() => setMessage("")}>{message}</Alert>}

            {/* Les 3 colonnes : côte à côte sur tablette et ordinateur, l'une sous l'autre sur mobile */}
            <Grid container spacing={2}>
                {COLONNES.map((colonne) => {
                    // Commandes de la colonne, les plus anciennes en haut (premières arrivées, premières servies)
                    const commandes = orders
                        .filter((o) => colonne.statuts.includes(o.status))
                        // Trie la colonne de la plus ancienne commande à la plus récente (premières arrivées, premières servies).
                        // localeCompare compare deux textes : les dates ISO ("2026-10-05T11:38:04Z") s'écrivent de l'année à la seconde,
                        // donc l'ordre alphabétique est aussi l'ordre chronologique.
                        // sort modifie le tableau sur place : sans risque ici, car filter vient de créer une nouvelle liste.
                        .sort((a, b) => a.created_at.localeCompare(b.created_at));

                    return (
                        // size : une ligne de la grille compte 12 parts ; xs: 12 = un élément par ligne (colonnes empilées sur mobile),
                        // md: 4 = trois éléments par ligne à partir de 900 px (4 + 4 + 4 = 12)
                        <Grid key={colonne.titre} size={{xs: 12, md: 4}}>
                            <Paper variant="outlined" sx={{p: 2, height: "100%", bgcolor: "action.hover"}}>
                                <Stack direction="row" spacing={1} sx={{alignItems: "center", mb: 2}}>
                                    <Typography variant="h6" component="h3">{colonne.titre}</Typography>
                                    <Chip size="small" label={commandes.length}/>
                                </Stack>

                                {/* Stack : empile les cartes verticalement ; spacing={2} = 16 px entre chaque carte
                                (unité MUI = 8 px)*/}
                                <Stack spacing={2}>
                                    {commandes.length === 0 && (
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                                            Aucune commande
                                        </Typography>
                                    )}

                                    {commandes.map((order) => {
                                        const minutes = minutesDepuis(order.created_at, maintenant);
                                        // En retard : pas encore commencée et en attente depuis trop longtemps
                                        const enRetard =
                                            (order.status === "pending" || order.status === "validated") &&
                                            minutes >= SEUIL_ALERTE_MINUTES;
                                        const action = ACTION_SUIVANTE[order.status];

                                        return (
                                            <Card
                                                key={order.order_number}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: enRetard ? "error.main" : "divider",
                                                    borderWidth: enRetard ? 2 : 1,
                                                }}
                                            >
                                                <CardContent sx={{pb: 1}}>
                                                    <Stack
                                                        direction="row"
                                                        sx={{
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        <Typography sx={{fontFamily: "monospace", fontWeight: 700}}>
                                                            {order.order_number}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            variant="outlined"
                                                            label={order.pickup_mode === "onsite" ? "Sur place" : "À emporter"}
                                                        />
                                                    </Stack>

                                                    <Typography variant="body2" sx={{color: "text.secondary", mb: 1}}>
                                                        {order.customer.name} · il y a {minutes} min
                                                    </Typography>

                                                    {enRetard && (
                                                        <Chip
                                                            size="small"
                                                            color="error"
                                                            icon={<WarningAmberIcon/>}
                                                            label={`En attente depuis ${minutes} min`}
                                                            sx={{mb: 1}}
                                                        />
                                                    )}

                                                    {/* Ce qu'il faut préparer : quantité et nom de chaque produit */}
                                                    <Box component="ul" sx={{m: 0, pl: 2.5}}>
                                                        {order.items.map((item) => (
                                                            <Typography component="li" variant="body2"
                                                                        key={item.product_id}>
                                                                <strong>{item.quantity} ×</strong> {nomProduit(item.product_id)}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </CardContent>

                                                {/* Boutons d'action, masqués pour la direction */}
                                                {!lectureSeule && (
                                                    <CardActions sx={{px: 2, pb: 2, gap: 1}}>
                                                        {action && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => changerStatut(order, action.suivant)}
                                                            >
                                                                {action.label}
                                                            </Button>
                                                        )}
                                                        <Button color="error" size="small"
                                                                onClick={() => setAAnnuler(order)}>
                                                            Annuler
                                                        </Button>
                                                    </CardActions>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Fenêtre de confirmation avant d'annuler : l'annulation est définitive */}
            <Dialog open={aAnnuler !== null} onClose={() => setAAnnuler(null)}>
                <DialogTitle>Annuler la commande {aAnnuler?.order_number} ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Le client verra sa commande annulée. Cette action est définitive.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAAnnuler(null)}>Retour</Button>
                    <Button color="error" variant="contained" onClick={confirmerAnnulation}>
                        Annuler la commande
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default cuisine;