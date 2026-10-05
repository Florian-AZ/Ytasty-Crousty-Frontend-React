import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  Box,
  Button,
  Container,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { viderPanier } from "../store/reducers/panier";
import ProductCard from "../components/ProductCard";

function Produits() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const recherche = searchParams.get("q") ?? "";
  const categorie = searchParams.get("category") ?? "";

  const restaurantSelectionne = searchParams.get("restaurant");
  const uniquementDisponibles = searchParams.get("available") === "true";

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
          pt: 2,
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

        <Typography variant="h4" sx={{ mb: 2 }}>
          Nos produits
        </Typography>
        <TextField
          label="Rechercher un produit"
          value={recherche}
          sx={{ mb: 2 }}
          onChange={(event) => {
            searchParams.set("q", event.target.value);
            setSearchParams(searchParams);
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 4,
            alignItems: "center",
          }}
        >
          <Button
            variant={categorie === "" ? "contained" : "outlined"}
            onClick={() => {
              searchParams.delete("category");
              setSearchParams(searchParams);
            }}
          >
            Tout
          </Button>
          <Button
            variant={categorie === "burgers" ? "contained" : "outlined"}
            onClick={() => {
              searchParams.set("category", "burgers");
              setSearchParams(searchParams);
            }}
          >
            Burgers
          </Button>
          <Button
            variant={categorie === "drinks" ? "contained" : "outlined"}
            onClick={() => {
              searchParams.set("category", "drinks");
              setSearchParams(searchParams);
            }}
          >
            Desserts
          </Button>

          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>Disponibles uniquement</Typography>

            <Switch
              checked={uniquementDisponibles}
              onChange={(event) => {
                if (event.target.checked) {
                  searchParams.set("available", "true");
                } else {
                  searchParams.delete("available");
                }

                setSearchParams(searchParams);
              }}
            />
          </Box>
        </Box>
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
            .filter((produit) =>
              produit.name.toLowerCase().includes(recherche.toLowerCase()),
            )
            .filter((produit) =>
              categorie === "" ? true : produit.category === categorie,
            )
            .filter((produit) =>
              uniquementDisponibles ? produit.is_available : true,
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
