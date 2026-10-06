import { useParams } from "react-router-dom";
import { api } from "../services/api.ts";
import type { Order } from "../types/order.ts";
import { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  type ChipProps,
  Paper,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate, formatPrix } from "../utils/format.ts";
import axios from "axios";
import ProductCard from "../components/ProductCard.tsx";

// Libellé et couleur du badge pour chaque statut renvoyé par l'API
const STATUTS: Record<string, { label: string; color: ChipProps["color"] }> = {
  pending: { label: "Reçue", color: "default" },
  validated: { label: "Validée", color: "info" },
  preparing: { label: "En préparation", color: "warning" },
  ready: { label: "Prête", color: "success" },
  collected: { label: "Récupérée", color: "primary" },
  cancelled: { label: "Annulée", color: "error" },
};

// Étapes affichées dans le Stepper, dans l'ordre (cancelled n'en fait pas partie)
const ETAPES = ["pending", "validated", "preparing", "ready", "collected"];

function OrderSuivi() {
  const { order_number } = useParams();

  const [order, setOrder] = useState<Order | null>(null); // null tant que rien n'est chargé
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Chargement de la commande à l'affichage de la page, et si le numéro dans l'URL change
  useEffect(() => {
    if (!order_number) return;

    // Un useEffect ne peut pas être async : on crée une fonction async à l'intérieur, puis on l'appelle
    const chargerCommande = async () => {
      setLoading(true);
      setMessage("");
      try {
        const response = await api.get<Order>(`/orders/${order_number}`);
        console.log("appel de order suivi", response.data);
        setOrder(response.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setMessage("Aucune commande ne correspond à ce numéro.");
        } else {
          setMessage(
            "Impossible de récupérer la commande. Réessayez plus tard.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    chargerCommande();
  }, [order_number]);

  // Trois états possibles avant d'afficher la commande
  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 8 }} />;
  if (message) return <Alert severity="error">{message}</Alert>;
  if (!order) return null;

  // Badge du statut ; valeurs par défaut si l'API renvoyait un statut inconnu
  const statut = STATUTS[order.status] ?? {
    label: order.status,
    color: "default",
  };
  // Étape en cours ; "collected" = toutes les étapes cochées
  const etapeActive =
    order.status === "collected" ? ETAPES.length : ETAPES.indexOf(order.status);
  const surPlace = order.pickup_mode === "onsite";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* En-tête : numéro, date, badge du statut */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: "text.secondary" }}>
                Commande
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontFamily: "monospace", fontWeight: 700 }}
              >
                {order.order_number}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Passée le {formatDate(order.created_at)}
              </Typography>
            </Box>
            <Chip
              label={statut.label}
              color={statut.color}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Paper>

        {/* Suivi : étapes de la commande, ou alerte si elle est annulée */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          {order.status === "cancelled" ? (
            <Alert severity="error">Cette commande a été annulée.</Alert>
          ) : (
            <Stepper activeStep={etapeActive} alternativeLabel>
              {ETAPES.map((etape) => (
                <Step key={etape}>
                  <StepLabel>{STATUTS[etape].label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Paper>

        {/* Mode de retrait et client, côte à côte sur grand écran */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                {surPlace ? (
                  <RestaurantIcon color="primary" />
                ) : (
                  <ShoppingBagIcon color="primary" />
                )}
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Mode de retrait
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {surPlace ? "Sur place" : "À emporter"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <PersonIcon color="primary" />
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Client
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {order.customer.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {order.customer.email}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Articles commandés */}
        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Articles
          </Typography>
          <Grid container spacing={2}>
            {order.items.map((item) => (
              <Grid key={item.product_id} size={{ xs: 12, sm: 6 }}>
                <ProductCard
                  produit_id={item.product_id}
                  quantity={item.quantity}
                  page="order"
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Total payé, mis en avant */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="p">
            Total payé
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {formatPrix(order.total_price)}
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}

export default OrderSuivi;
