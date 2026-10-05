import {Button, Card, CardContent, Skeleton, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {formatPrix} from "../utils/format.ts";



interface ProductCardProps {
    produit_id: number;
    page?: string;     // si renseigné (ex : "validation"), le bouton d'ajout est masqué
    quantity?: number; // si renseigné, la quantité est affichée
}

function ProductCard({produit_id, page, quantity}: ProductCardProps) {
    const produit = useSelector((state: RootState) => state.products.products.find(p => p.id === produit_id));
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
                    <Typography variant="body2">Quantité : {quantity}</Typography>
                )}
                <Typography variant="body2">
                    {produit.is_available ? "Disponible" : "Indisponible"}
                </Typography>
            </CardContent>

            {!page && (
                <Button variant="contained" sx={{ mt: 2, mb: 2, mx: "auto", display: "block" }}>
                    Ajouter au panier
                </Button>
            )}
        </Card>
    )
}

export default ProductCard;