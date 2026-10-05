import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import {
  ajouterPanier,
  retirerPanier,
  viderPanier,
} from "../store/reducers/panier";
import ProductCard from "../components/ProductCard";

function Produits() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const restaurantSelectionne = searchParams.get("restaurant");

  const produits = useSelector((state: RootState) => state.products);
  const restaurants = useSelector((state: RootState) => state.restaurants);
  const panier = useSelector((state: RootState) => state.panier);
  const restaurantPanier = panier.panier[0]?.produit.restaurant_id;
  const changerRestaurant = (restaurantId: number) => {
    if (restaurantPanier && restaurantPanier !== restaurantId) {
      const confirmation = confirm(
        "Changer de restaurant videra votre panier. Continuer ?",
      );

      if (!confirmation) {
        return;
      }

      dispatch(viderPanier());
    }
    setSearchParams(`restaurant=${restaurantId}`);
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          pt: 16,
          pb: 6,
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          {" "}
          Choisissez votre restaurant
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          {restaurants.restaurants.map((restaurant) => (
            <Button
              variant={
                restaurantSelectionne === String(restaurant.id)
                  ? "contained"
                  : "outlined"
              }
              onClick={() => changerRestaurant(Number(restaurant.id))}
            >
              {restaurant.name}
            </Button>
          ))}
        </Box>

        <Typography variant="h4" sx={{ mb: 4 }}>
          Nos produits
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {!restaurantSelectionne && (
            <Typography
              variant="h4"
              sx={{ mb: 4, textAlign: "center", gridColumn: "1 / -1" }}
            >
              Choisissez votre restaurant afin de voir quels prodits sont
              disponibles !
            </Typography>
          )}
          {produits.products
            .filter(
              (produit) =>
                produit.restaurant_id === Number(restaurantSelectionne),
            )
            .map((produit) => {
              const produitDansPanier = panier.panier.find(
                (element) => element.produit.id === produit.id,
              );

              return (
                <ProductCard
                  produit_id={produit.id}
                  quantity={produitDansPanier?.quantite}
                />
              );
            })}
        </Box>
      </Container>
    </>
  );
}

export default Produits;
