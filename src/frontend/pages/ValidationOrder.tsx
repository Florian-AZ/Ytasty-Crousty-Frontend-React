import {
    Accordion, AccordionDetails, AccordionSummary,
    Alert,
    Box,
    Button,
    Card, CardActionArea, CardContent, CardMedia, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Stack,
    TextField, Typography
} from "@mui/material";
import {type SyntheticEvent, useEffect, useState} from "react";
import takeawayImg from "../assets/MascoteEmporter.png";
import onsiteImg from "../assets/MascoteSurPlace.png";
import Container from "@mui/material/Container";
import {api} from "../services/api";
import type {Order} from "../types/order.ts";
import axios from "axios";
import ProductCard from "../components/ProductCard.tsx";
import {formatPrix} from "../utils/format.ts";
import {isValidEmail} from "../utils/validation.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ValidationOrder() {
    /*{
        "restaurant_id": 0,
        "items": [
        {
            "product_id": 0,
            "quantity": 1
        }
    ],
        "pickup_mode": "onsite",
        "customer": {
        "name": "string",
            "email": ",2p;^K1ySBsA:dtFN.qE3cFV8{,t5TOhcQZ]#B*Tnx1=/5{Nd;Q>VQ'@BR3.1M}}{xX1rqc{(7T~!%ZBUwtZ$y=)#:UpX5bd)989=4TI1[c2&fpIz"
    }
    }*/
    interface PanierItem {
        product_id: number;
        prix_unitaire: number;
        quantity: number;
    }

    const panier_test:PanierItem[] = [
        {
            "product_id": 1,
            "prix_unitaire": 9.9,
            "quantity": 1
        },
        {
            "product_id": 2,
            "prix_unitaire": 8.9,
            "quantity": 1
        },
        {
            "product_id": 3,
            "prix_unitaire": 10.5,
            "quantity": 1
        },
    ];
    const RESTAU = [
        {
            "id": 1,
            "name": "Ytasty Crousty Aix",
            "city": "Aix-en-Provence",
            "address": "12 cours Mirabeau",
            "opening_hours": "11h-23h",
            "contact": "0442000001"
        },
        {
            "id": 2,
            "name": "Ytasty Crousty Lyon",
            "city": "Lyon",
            "address": "5 rue de la République",
            "opening_hours": "11h-23h",
            "contact": "0472000002"
        },
        {
            "id": 3,
            "name": "Ytasty Crousty Paris",
            "city": "Paris",
            "address": "20 boulevard Saint-Michel",
            "opening_hours": "11h-00h",
            "contact": "0140000003"
        }
    ]
    const [restaurantId, setRestaurantId] = useState<number>()
    const [pickupMode, setPickupMode] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [customerEmail, setCustomerEmail] = useState<string>("")
    const [items] = useState<PanierItem[]>(panier_test)
    // Total indicatif : c'est l'API qui calcule le vrai prix
    const total = items.reduce((somme, item) => somme + item.prix_unitaire * item.quantity, 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const nbArticles = items.reduce((somme, item) => somme + item.quantity, 0);


    useEffect(() => {
        console.log("----------Validation order----------")
        console.log({restaurantId, pickupMode, customerName, customerEmail, items})
        console.log("------------------------------------")
    }, [restaurantId, pickupMode, customerName, customerEmail, items]);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            const response = await api.post<Order[]>("/orders", {
                "restaurant_id": restaurantId,
                "items": items.map((item) => (
                    {
                        "product_id": item.product_id,
                        "quantity": item.quantity
                    }
                )),
                "pickup_mode": pickupMode,
                "customer": {
                    "name": customerName,
                    "email": customerEmail
                }
            })
            console.log("----------Orders----------")
            console.log(response.data)
            console.log("------------------------------------")
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 400) {
                // Refus métier : on affiche directement le message envoyé par l'API
                setMessage(e.response.data.detail);
                console.log(e.response.data.detail)
            } else if (axios.isAxiosError(e) && e.response?.status === 422) {
                // si les infos ne rejoignent pas ce que l'api veut (normalement impossible)
                setMessage("Certaines informations sont invalides.");
                console.log(e.response.data.detail)
            } else if (axios.isAxiosError(e) && !e.response) {
                // Aucune réponse : l'API est éteinte ou injoignable
                setMessage("L'API est inaccessible. Vérifiez que le backend est lancé.");
                console.log("L'API est inaccessible. Vérifiez que le backend est lancé.")
            } else {
                setMessage("La commande a échoué. Veuillez réessayer.");
            }
        } finally {
            // Exécuté dans tous les cas, succès ou erreur : on réactive le bouton
            setIsSubmitting(false);
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{display: "flex", flexDirection: "column", gap: 3}}
        >
            <Container maxWidth="sm" sx={{py: 4}}>

                <Stack spacing={4}>
                    <Typography variant="h4" component="h1" align="center">
                        Validation de la commande
                    </Typography>

                    <Accordion>
                        {/* La barre cliquable, avec la flèche à droite */}
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">
                                Votre panier ({nbArticles} articles)
                            </Typography>
                        </AccordionSummary>

                    <AccordionDetails>
                    {/* Grid : une carte par ligne sur mobile, deux à partir des tablettes */}
                    <Grid container spacing={2}>
                        {items.map((item) => (
                            <Grid key={item.product_id} size={{ xs: 12, sm: 6 }}>
                                <ProductCard produit_id={item.product_id} quantity={item.quantity} page="validation" />
                            </Grid>
                        ))}
                    </Grid>
                    </AccordionDetails>
                </Accordion>

                    <Typography variant="h6" align="right">
                        Total : {formatPrix(total)}
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel id="restaurant-label">Restaurant</InputLabel>
                        <Select
                            labelId="restaurant-label"
                            id="restaurant-select"
                            value={restaurantId}
                            label="Restaurant"
                            onChange={(e) => setRestaurantId(Number(e.target.value))}
                        >
                            {RESTAU.map((r) => (
                                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel id="pickup-mode-label" sx={{mb: 2, textAlign: "center"}}>
                            Mode de retrait
                        </FormLabel>

                        {/* Les deux cartes côte à côte, centrées ; l'une sous l'autre sur mobile */}
                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={2}
                            sx={{justifyContent: "center", alignItems: "center"}}
                        >
                            <Card
                                sx={{
                                    width: 250,
                                    height: 300,
                                    border: 2,
                                    borderColor: pickupMode === "takeaway" ? "primary.main" : "transparent",
                                }}
                            >
                                <CardActionArea sx={{
                                    height: "100%",               // la zone cliquable remplit toute la carte
                                    display: "flex",
                                    flexDirection: "column",      // image puis texte, l'un sous l'autre
                                    justifyContent: "flex-start", // collés en haut au lieu d'être centrés
                                    alignItems: "stretch",
                                }} onClick={() => setPickupMode("takeaway")}>
                                    <CardMedia component="img" height="140" image={takeawayImg} alt="À emporter"/>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            À emporter
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                                            Récupérez votre commande <br/>
                                            au restaurant
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>

                            <Card
                                sx={{
                                    width: 250,
                                    height: 300,
                                    border: 2,
                                    borderColor: pickupMode === "onsite" ? "primary.main" : "transparent",
                                }}
                            >
                                <CardActionArea sx={{
                                    height: "100%",               // la zone cliquable remplit toute la carte
                                    display: "flex",
                                    flexDirection: "column",      // image puis texte, l'un sous l'autre
                                    justifyContent: "flex-start", // collés en haut au lieu d'être centrés
                                    alignItems: "stretch",
                                }} onClick={() => setPickupMode("onsite")}>
                                    <CardMedia component="img" height="140" image={onsiteImg} alt="Sur place"/>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Sur place
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                                            Mangez au restaurant
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Stack>
                    </FormControl>

                    <Stack spacing={2}>
                        <TextField
                            required
                            fullWidth
                            id="customer-name"
                            label="Nom"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <TextField
                            required
                            fullWidth
                            id="customer-email"
                            label="Email"
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            error={!isValidEmail(customerEmail)}
                            helperText={!isValidEmail(customerEmail) ? "Veuillez entrer un email valide (ex : nom@exemple.fr)" : ""}
                        />
                    </Stack>
                    {message && <Alert severity="error">{message}</Alert>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!restaurantId || !pickupMode || !customerName || !isValidEmail(customerEmail) || items.length <= 0 || isSubmitting}
                        sx={{mt: 3, minHeight: 48}}
                    >
                        {isSubmitting ? "Validation en cours..." : "Validation"}
                    </Button>
                </Stack>
            </Container>
        </Box>
    )
}

export default ValidationOrder