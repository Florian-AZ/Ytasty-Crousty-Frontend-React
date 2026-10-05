import {Button, Card, CardContent, Skeleton, Typography} from "@mui/material";
import CrispyChickenBurger from "../assets/CrispyChickenBurger.png";
import DoubleCheese from "../assets/DoubleCheeseBurger.png";
import Tenders from "../assets/6xTenders.png";
import Frites from "../assets/Frites.png";
import SpicyChikenWrap from "../assets/SpicyChickenWrap.png";
import VeganBurger from "../assets/VeganBurger.png";
import Milkshake from "../assets/Milkshake.png";
import CroustyBox from "../assets/CroustyBox.png";
import BurgerTest from "../assets/BurgerTest.png";
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
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <img
                src={photoProduit(produit.name)}
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