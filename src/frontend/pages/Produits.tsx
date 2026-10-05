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

function Produits() {
  function ajouterPanier() {}

  const produits = useSelector((state: RootState) => state.products);

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
                src={produit.image}
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
