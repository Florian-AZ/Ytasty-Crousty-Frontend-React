import {
    Card, CardActionArea, CardContent, CardMedia, FormControl, FormLabel, InputLabel, MenuItem, Select, Stack,
    TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import takeawayImg from "../assets/hero.png";
import onsiteImg from "../assets/image.png";
import Container from "@mui/material/Container";

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
    const panier_test = [
        {
            "product_id": 1,
            "prix_unitaire": 9.9,
            "quantity": 1
        },
        {
            "product_id": 5,
            "prix_unitaire": 8.9,
            "quantity": 1
        },
        {
            "product_id": 6,
            "prix_unitaire": 10.5,
            "quantity": 1
        },
        {
            "product_id": 7,
            "prix_unitaire": 4.5,
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
    const [restaurantId, setRestaurantId] = useState<number>(1)
    const [pickupMode, setPickupMode] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [customerEmail, setCustomerEmail] = useState<string>("")
    const [items] = useState<any[]>(panier_test)
    useEffect(() => {
        console.log("----------Validation order----------")
        console.log({restaurantId, pickupMode, customerName, customerEmail, items})
        console.log("------------------------------------")
    }, [restaurantId, pickupMode, customerName, customerEmail, items]);


    return (
        // Container : centre la page et limite sa largeur ; py = marge en haut et en bas
        <Container maxWidth="sm" sx={{py: 4}}>
            {/* Stack : empile les blocs verticalement, spacing = espace entre chaque bloc */}
            <Stack spacing={4}>
                <Typography variant="h4" component="h1" align="center">
                    Validation de la commande
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
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                        <Card
                            sx={{
                                maxWidth: 345,
                                border: 2,
                                borderColor: pickupMode === "takeaway" ? "primary.main" : "transparent",
                            }}
                        >
                            <CardActionArea onClick={() => setPickupMode("takeaway")}>
                                <CardMedia component="img" height="140" image={takeawayImg} alt="À emporter"/>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        À emporter
                                    </Typography>
                                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                                        Récupérez votre commande au restaurant
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                        <Card
                            sx={{
                                maxWidth: 345,
                                border: 2,
                                borderColor: pickupMode === "onsite" ? "primary.main" : "transparent",
                            }}
                        >
                            <CardActionArea onClick={() => setPickupMode("onsite")}>
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

                {/* Les deux champs l'un sous l'autre, sur toute la largeur */}
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
                    />
                </Stack>
            </Stack>
        </Container>
    )
}

export default ValidationOrder