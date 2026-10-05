import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import { formatPrix } from "../utils/format.ts";
import { ajouterPanier, retirerPanier } from "../store/reducers/panier";

interface ProductCardProps {
  produit_id: number;
  page?: string; // si renseigné (ex : "validation"), le bouton d'ajout est masqué
  quantity?: number; // si renseigné, la quantité est affichée
}

function ProductCard({ produit_id, page, quantity }: ProductCardProps) {
  const dispatch = useDispatch();
  const produit = useSelector((state: RootState) =>
    state.products.products.find((p) => p.id === produit_id),
  );

  const restaurant = useSelector((state: RootState) =>
    state.restaurants.restaurants.find(
      (restaurant) => restaurant.id === produit?.restaurant_id,
    ),
  );

  if (!produit) {
    return <Skeleton variant="rounded" height={320} />;
  }
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <img
        src={produit.image}
        alt={produit.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "contain",
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{produit.name}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {produit.description}
        </Typography>
        <Typography>{formatPrix(produit.price)}</Typography>
        {quantity !== undefined && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 2,
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

              <Typography>{quantity}</Typography>

              <IconButton
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
                disabled={!produit.is_available || !restaurant?.is_open}
              >
                +
              </IconButton>
            </Box>
          </>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          {produit.is_available ? "Disponible" : "Indisponible"}
        </Typography>
      </CardContent>

      {quantity === undefined && !page && (
        <Button
          onClick={() =>
            dispatch(
              ajouterPanier({
                produit: produit,
                quantite: 1,
              }),
            )
          }
          variant="contained"
          sx={{ mt: 2, mb: 2, mx: "auto", display: "block" }}
          disabled={!produit.is_available || !restaurant?.is_open}
        >
          Ajouter au panier
        </Button>
      )}
    </Card>
  );
}

export default ProductCard;
