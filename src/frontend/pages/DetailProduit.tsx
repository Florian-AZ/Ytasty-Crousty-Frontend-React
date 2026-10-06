import {
  Box,
  Button,
  Container,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ajouterPanier, retirerPanier } from "../store/reducers/panier";
import { formatPrix } from "../utils/format";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const produits = useSelector((state: RootState) => state.products.products);

  const produit = produits.find((produit) => produit.id === Number(id));

  const restaurant = useSelector((state: RootState) =>
    state.restaurants.restaurants.find(
      (restaurant) => restaurant.id === produit?.restaurant_id,
    ),
  );

  const panier = useSelector((state: RootState) => state.panier);

  const produitDansPanier = panier.panier.find(
    (element) => element.produit.id === produit?.id,
  );

  if (produits.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rounded" height={500} />
      </Container>
    );
  }

  if (!produit) {
    return <Navigate to="/erreur/404" replace />;
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to={`/produits?restaurant=${produit.restaurant_id}`}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Retour aux produits
      </Button>

      <Box
        sx={{
          display: "flex",
          gap: 5,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <img
            src={produit.image}
            alt={produit.name}
            style={{
              width: "100%",
              maxHeight: "450px",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {produit.name}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {produit.description}
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            {formatPrix(produit.price)}
          </Typography>

          <Typography sx={{ mb: 1 }}>Catégorie : {produit.category}</Typography>

          <Typography sx={{ mb: 1 }}>
            Restaurant : {restaurant?.name}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            Disponibilité :{" "}
            {produit.is_available ? "Disponible" : "Indisponible"}
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Restaurant : {restaurant?.is_open ? "Ouvert" : "Fermé"}
          </Typography>

          {produit.ingredients.length > 0 && (
            <Typography sx={{ mb: 3 }}>
              Ingrédients : {produit.ingredients.join(", ")}
            </Typography>
          )}

          {!produitDansPanier ? (
            <Button
              variant="contained"
              disabled={!produit.is_available || !restaurant?.is_open}
              onClick={() =>
                dispatch(
                  ajouterPanier({
                    produit: produit,
                    quantite: 1,
                  }),
                )
              }
            >
              Ajouter au panier
            </Button>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton
                onClick={() =>
                  dispatch(
                    retirerPanier({
                      produit: produit,
                      quantite: 1,
                    }),
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
                disabled={!produit.is_available || !restaurant?.is_open}
                onClick={() =>
                  dispatch(
                    ajouterPanier({
                      produit: produit,
                      quantite: 1,
                    }),
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
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ProductDetail;
