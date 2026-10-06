import * as React from "react";
import {styled, alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logo from "./Logo";
import {Badge, ListItemButton} from "@mui/material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ajouterPanier, retirerPanier} from "../store/reducers/panier";
import type {RootState} from "../store/store.ts";
import ThemeToggle from "../theme/changementtheme.tsx";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: "blur(24px)",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: "8px 12px",
}));

export default function Navbar() {
    const user = useSelector((state: RootState) => state.userLogged.userLogged);
    const panier = useSelector((state: RootState) => state.panier);
    const [open, setOpen] = React.useState(false);
    const [panierOpen, setPanierOpen] = React.useState(false);
    const dispatch = useDispatch();
    let nbArticles = 0;
    let total = 0;
    const restaurants = useSelector(
        (state: RootState) => state.restaurants.restaurants,
    );

    for (const produit of panier.panier) {
        nbArticles = nbArticles + produit.quantite;
    }

    for (const produit of panier.panier) {
        total = total + produit.produit.price * produit.quantite;
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <AppBar
                position="fixed"
                enableColorOnDark
                sx={{
                    boxShadow: 0,
                    bgcolor: "transparent",
                    backgroundImage: "none",
                    mt: "28px",
                }}
            >
                <Container maxWidth="lg">
                    <StyledToolbar variant="dense" disableGutters>
                        <Box
                            sx={{flexGrow: 1, display: "flex", alignItems: "center", px: 0}}
                        >
                            <Link to={"/"}>
                                <Logo height={50} width={75}/>
                            </Link>

                            <Box sx={{display: {xs: "none", md: "flex"}}}>
                                <Link to={"/produits"}>
                                    <Button variant="text" color="primary" size="small">
                                        Nos Plats
                                    </Button>
                                </Link>
                                <Link to={"/Validation"}>
                                    <Button variant="text" color="primary" size="small">
                                        Commander
                                    </Button>
                                </Link>
                                <Link to={"/order"}>
                                    <Button variant="text" color="primary" size="small">
                                        Suivi de commande
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: {xs: "none", md: "flex"},
                                gap: 1,
                                alignItems: "center",
                            }}
                        >
                            <ThemeToggle/>
                            <IconButton color="primary" onClick={() => setPanierOpen(true)}>
                                <Badge
                                    badgeContent={nbArticles}
                                    color="warning"
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            fontSize: 10,
                                            minWidth: 15,
                                            height: 15,
                                        },
                                    }}
                                >
                                    <ShoppingCartRoundedIcon sx={{fontSize: 26}}/>
                                </Badge>
                            </IconButton>
                            {user ? (
                                <Button
                                    component={Link}
                                    to="/back-office"
                                    color="secondary"
                                    variant="text"
                                    size="small"
                                >
                                    Espace sécurisé
                                </Button>
                            ) : (
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                >
                                    Connexion
                                </Button>
                            )}
                        </Box>
                        <Box sx={{display: {xs: "flex", md: "none"}, gap: 1}}>
                            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                                <MenuIcon/>
                            </IconButton>
                            <Drawer
                                anchor="top"
                                open={open}
                                onClose={toggleDrawer(false)}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            top: "var(--template-frame-height, 0px)",
                                        },
                                    },
                                }}
                            >
                                <Box sx={{p: 2, backgroundColor: "background.default"}}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <IconButton onClick={toggleDrawer(false)}>
                                            <CloseRoundedIcon/>
                                        </IconButton>
                                    </Box>

                                    <ListItemButton component={Link} to="/produits" onClick={toggleDrawer(false)}>
                                        Nos Plats
                                    </ListItemButton>
                                    <ListItemButton component={Link} to="/Validation" onClick={toggleDrawer(false)}>
                                        Commander
                                    </ListItemButton>
                                    <ListItemButton component={Link} to="/order" onClick={toggleDrawer(false)}>
                                        Suivi de commande
                                    </ListItemButton>
                                    {/* Panier : referme le menu et ouvre le panier latéral */}
                                    <ListItemButton
                                        onClick={() => {
                                            setOpen(false);
                                            setPanierOpen(true);
                                        }}
                                        sx={{gap: 1.5}}
                                    >
                                        <Badge badgeContent={nbArticles} color="warning">
                                            <ShoppingCartRoundedIcon/>
                                        </Badge>
                                        Panier
                                    </ListItemButton>
                                    <Divider sx={{my: 2}}/>
                                    {/* Même contenu que la droite de la barre : thème et espace sécurisé / connexion */}
                                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                        <ThemeToggle/>
                                        {user ? (
                                            <Button
                                                component={Link}
                                                to="/back-office"
                                                color="secondary"
                                                variant="contained"
                                                fullWidth
                                                onClick={toggleDrawer(false)}
                                            >
                                                Espace sécurisé
                                            </Button>
                                        ) : (
                                            <Button
                                                component={Link}
                                                to="/login"
                                                color="primary"
                                                variant="contained"
                                                fullWidth
                                                onClick={toggleDrawer(false)}
                                            >
                                                Connexion
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Drawer>
                        </Box>
                    </StyledToolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="right"
                open={panierOpen}
                onClose={() => setPanierOpen(false)}
            >
                <Box sx={{width: 350, p: 3}}>
                    <h2>Panier</h2>

                    {panier.panier.map((articlePanier) => {
                        const restaurantProduit = restaurants.find(
                            (restaurant) =>
                                restaurant.id === articlePanier.produit.restaurant_id,
                        );

                        return (
                            <Box key={articlePanier.produit.id}>
                                {articlePanier.produit.name} — {articlePanier.quantite}{" "}
                                <IconButton
                                    onClick={() =>
                                        dispatch(
                                            retirerPanier({
                                                produit: articlePanier.produit,
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
                                <IconButton
                                    onClick={() =>
                                        dispatch(
                                            ajouterPanier({
                                                produit: articlePanier.produit,
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
                                    disabled={
                                        !articlePanier.produit.is_available ||
                                        !restaurantProduit?.is_open
                                    }
                                >
                                    +
                                </IconButton>
                            </Box>
                        );
                    })}
                    <Divider sx={{my: 2}}/>

                    <Box>Total : {total} €</Box>
                    <Button
                        component={Link}
                        to="/Validation"
                        variant="contained"
                        fullWidth
                        sx={{mt: 2}}
                        onClick={() => setPanierOpen(false)}
                    >
                        Valider la commande
                    </Button>
                </Box>
            </Drawer>
            <Box sx={{height: 112}}/>
        </>
    );
}
