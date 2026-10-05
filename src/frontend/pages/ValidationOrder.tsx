// ValidationOrder.tsx : page de validation de la commande.
// Le client vérifie son panier, choisit le restaurant et le mode de retrait, saisit son nom et son email,
// puis la commande est envoyée à l'API (POST /orders). En cas de succès, il est redirigé vers la page de suivi.
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type SyntheticEvent, useEffect, useState } from "react";
// Images importées : Vite les copie dans le build et fournit leur URL finale
import takeawayImg from "../assets/MascoteEmporter.png";
import onsiteImg from "../assets/MascoteSurPlace.png";
import Container from "@mui/material/Container";
import { api } from "../services/api";
import type { Order } from "../types/order.ts";
import axios from "axios";
import ProductCard from "../components/ProductCard.tsx";
import { formatPrix } from "../utils/format.ts";
import { isValidEmail } from "../utils/validation.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viderPanier } from "../store/reducers/panier";
import type { RootState } from "../store/store.ts";

function ValidationOrder() {
  // Exemple du corps attendu par POST /orders (gardé comme référence)
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

  // Restaurants chargés depuis l'API (GET /restaurants), lus dans le store Redux
  const RESTAU = useSelector(
    (state: RootState) => state.restaurants.restaurants,
  );

  const PANIER = useSelector((state: RootState) => state.panier);
  const dispatch = useDispatch();

  // useNavigate : permet de changer de page depuis le code (après la création de la commande)
  let navigate = useNavigate();

  // Champs du formulaire : chacun mis à jour par le onChange (ou onClick) de son composant
  const RESTAUID = PANIER.panier[0]?.produit.restaurant_id;
  const [pickupMode, setPickupMode] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const itemsPanier = PANIER.panier.map((produit) => ({
    product_id: produit.produit.id,
    prix_unitaire: produit.produit.price,
    quantity: produit.quantite,
  }));
  const items = itemsPanier;
  const RESTAURANTSELECTIONNE = RESTAU.find(
    (restaurant) => restaurant.id === RESTAUID,
  );

  // reduce : parcourt le panier en accumulant une valeur (ici la somme prix x quantité), en partant de 0
  // Total indicatif : c'est l'API qui calcule le vrai prix
  const total = items.reduce(
    (somme, item) => somme + item.prix_unitaire * item.quantity,
    0,
  );

  // true pendant l'envoi de la commande : désactive le bouton pour éviter un double envoi
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Message d'erreur affiché au-dessus du bouton ("" = aucune erreur)
  const [message, setMessage] = useState("");
  // Nombre total d'articles (somme des quantités), affiché dans la barre du panier
  const nbArticles = items.reduce((somme, item) => somme + item.quantity, 0);

  // Débogage : affiche l'état du formulaire dans la console à chaque modification d'un champ
  useEffect(() => {
    console.log("----------Validation order----------");
    console.log({
      RESTAUID,
      pickupMode,
      customerName,
      customerEmail,
      items,
    });
    console.log("------------------------------------");
  }, [RESTAUID, pickupMode, customerName, customerEmail, items]);

  // Envoi de la commande à l'API, déclenché par le bouton "Validation" ou la touche Entrée
  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); // empêche le rechargement de la page par le formulaire

    setIsSubmitting(true);
    try {
      // POST /orders : une seule commande en retour, d'où Order et non Order[]
      const response = await api.post<Order>("/orders", {
        restaurant_id: RESTAUID,
        // Le panier est transformé au format attendu par l'API : seulement l'id et la quantité (pas le prix)
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        pickup_mode: pickupMode,
        customer: {
          name: customerName,
          email: customerEmail,
        },
      });
      console.log("----------Orders----------");
      console.log(response.data);
      console.log("------------------------------------");
      dispatch(viderPanier());
      // Commande créée : redirection vers la page de suivi, avec le numéro renvoyé par l'API
      navigate(`/order/${response.data.order_number}`);
    } catch (e) {
      // axios lance une exception pour toute réponse en erreur (400, 422, 500...) ou absence de réponse
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        // Refus métier : on affiche directement le message envoyé par l'API
        setMessage(e.response.data.detail);
        console.log(e.response.data.detail);
      } else if (axios.isAxiosError(e) && e.response?.status === 422) {
        // si les infos ne rejoignent pas ce que l'api veut (normalement impossible)
        setMessage("Certaines informations sont invalides.");
        console.log(e.response.data.detail);
      } else if (axios.isAxiosError(e) && !e.response) {
        // Aucune réponse : l'API est éteinte ou injoignable
        setMessage(
          "L'API est inaccessible. Vérifiez que le backend est lancé.",
        );
        console.log(
          "L'API est inaccessible. Vérifiez que le backend est lancé.",
        );
      } else {
        // Tout autre cas (erreur 500 par exemple)
        setMessage("La commande a échoué. Veuillez réessayer.");
      }
    } finally {
      // Exécuté dans tous les cas, succès ou erreur : on réactive le bouton
      setIsSubmitting(false);
    }
  }

  console.log({
    RESTAUID,
    pickupMode,
    customerName,
    customerEmail,
    emailValide: isValidEmail(customerEmail),
    nbItems: items.length,
    isSubmitting,
  });

  return (
    // Box component="form" : toute la page est un formulaire, onSubmit appelle handleSubmit
    // noValidate : désactive les bulles d'erreur du navigateur, la validation est faite par le code
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Container : centre la page et limite sa largeur ; py = marge en haut et en bas */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Stack : empile les blocs verticalement, spacing = espace entre chaque bloc */}
        <Stack spacing={4}>
          <Typography variant="h4" component="h1" align="center">
            Validation de la commande
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            color="secondary"
          >
            {RESTAURANTSELECTIONNE?.name}
          </Typography>
          {/* Accordion : panier repliable ; un clic sur la barre l'ouvre ou le ferme */}
          <Accordion>
            {/* La barre cliquable, avec la flèche à droite */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Votre panier ({nbArticles} articles)
              </Typography>
            </AccordionSummary>

            {/* Le contenu affiché ou caché : les cartes des produits du panier */}
            <AccordionDetails>
              {/* Grid : une carte par ligne sur mobile, deux à partir des tablettes */}
              <Grid container spacing={2}>
                {items.map((item) => (
                  // page="validation" : la carte n'affiche pas le bouton "Ajouter au panier"
                  <Grid key={item.product_id} size={{ xs: 12, sm: 6 }}>
                    <ProductCard
                      produit_id={item.product_id}
                      quantity={item.quantity}
                      page="validation"
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Typography variant="h6" align="right">
            Total : {formatPrix(total)}
          </Typography>

          <FormControl>
            <FormLabel>Mode de retrait</FormLabel>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor:
                      pickupMode === "onsite" ? "primary.main" : "divider",
                  }}
                >
                  <CardActionArea onClick={() => setPickupMode("onsite")}>
                    <CardMedia
                      component="img"
                      image={onsiteImg}
                      alt="Sur place"
                      sx={{
                        height: 150,
                        objectFit: "contain",
                      }}
                    />

                    <CardContent>
                      <Typography align="center" variant="h6">
                        Sur place
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor:
                      pickupMode === "takeaway" ? "primary.main" : "divider",
                  }}
                >
                  <CardActionArea onClick={() => setPickupMode("takeaway")}>
                    <CardMedia
                      component="img"
                      image={takeawayImg}
                      alt="À emporter"
                      sx={{
                        height: 150,
                        objectFit: "contain",
                      }}
                    />

                    <CardContent>
                      <Typography align="center" variant="h6">
                        À emporter
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
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
              type="email" // sur mobile, le clavier affiche directement le @
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              // error : champ en rouge ; helperText : message sous le champ
              error={!isValidEmail(customerEmail)}
              helperText={
                !isValidEmail(customerEmail)
                  ? "Veuillez entrer un email valide (ex : nom@exemple.fr)"
                  : ""
              }
            />
          </Stack>
          {/* Message d'erreur de l'API, affiché seulement s'il y en a un */}
          {message && <Alert severity="error">{message}</Alert>}
          {/* Bouton d'envoi : désactivé tant que le formulaire est incomplet ou pendant l'envoi */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              !RESTAUID ||
              !pickupMode ||
              !customerName ||
              !isValidEmail(customerEmail) ||
              items.length <= 0 ||
              isSubmitting
            }
            sx={{ mt: 3, minHeight: 48 }}
          >
            {isSubmitting ? "Validation en cours..." : "Validation"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default ValidationOrder;
