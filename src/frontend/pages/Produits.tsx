import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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

function Produits() {
  function ajouterPanier() {}

  const produits = useSelector((state: RootState) => state.products);

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
          Nos produits
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {produits.products.map((produit) => (
            <Card key={produit.id}>
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
              <Button
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
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
}

export default Produits;
