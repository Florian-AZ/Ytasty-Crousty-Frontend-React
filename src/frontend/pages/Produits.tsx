import { useSelector } from "react-redux";
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
import CrispyChickenBurger from "../assets/CrispyChickenBurger.png";
import DoubleCheese from "../assets/DoubleCheeseBurger.png";
import Tenders from "../assets/6xTenders.png";
import Frites from "../assets/Frites.png";
import SpicyChikenWrap from "../assets/SpicyChickenWrap.png";
import VeganBurger from "../assets/VeganBurger.png";
import Milkshake from "../assets/Milkshake.png";
import CroustyBox from "../assets/CroustyBox.png";
import BurgerTest from "../assets/BurgerTest.png";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  viderPanier,
  ajouterPanier,
  retirerPanier,
} from "../store/reducers/panier";

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

  const photoProduit = (nomProduit: string | null) => {
    if (nomProduit === "Crispy Chicken Burger") {
      return CrispyChickenBurger;
    }
    if (nomProduit === "Double Cheese") {
      return DoubleCheese;
    }
    if (nomProduit === "Tenders x6") {
      return Tenders;
    }
    if (nomProduit === "Frites maison") {
      return Frites;
    }
    if (nomProduit === "Spicy Chicken Wrap") {
      return SpicyChikenWrap;
    }
    if (nomProduit === "Veggie Burger") {
      return VeganBurger;
    }
    if (nomProduit === "Milkshake Vanille") {
      return Milkshake;
    }
    if (nomProduit === "Crousty Box") {
      return CroustyBox;
    }
    if (nomProduit === "Burger Test") {
      return BurgerTest;
    }
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
                <Card>
                  <img
                    src={photoProduit(produit.name)}
                    alt={produit.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />

                  <CardContent>
                    <Typography variant="h6">{produit.name}</Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {produit.description}
                    </Typography>

                    <Typography>{produit.price} €</Typography>

                    <Typography variant="body2">
                      {produit.is_available ? "Disponible" : "Indisponible"}
                    </Typography>
                  </CardContent>

                  {!produitDansPanier ? (
                    <Button
                      onClick={() =>
                        dispatch(
                          ajouterPanier({ produit: produit, quantite: 1 }),
                        )
                      }
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 2,
                        mx: "auto",
                        display: "block",
                      }}
                    >
                      Ajouter au panier
                    </Button>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            dispatch(
                              retirerPanier({ produit: produit, quantite: -1 }),
                            )
                          }
                          sx={{
                            bgcolor: "error.main",
                            color: "white",
                            width: 36,
                            height: 36,
                          }}
                        >
                          -
                        </IconButton>

                        <Typography>{produitDansPanier.quantite}</Typography>

                        <IconButton
                          onClick={() =>
                            dispatch(
                              ajouterPanier({ produit: produit, quantite: 1 }),
                            )
                          }
                          sx={{
                            bgcolor: "success.main",
                            color: "white",
                            width: 36,
                            height: 36,
                          }}
                        >
                          +
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Card>
              );
            })}
        </Box>
      </Container>
    </>
  );
}

export default Produits;
