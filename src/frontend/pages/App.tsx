import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";

function App() {
    const restaurants = useSelector((state: RootState) => state.restaurants)
    return (
        <>
            <Container sx={{
                pt: 16,
                pb: 6,
            }}>
                <Stack spacing={2}>
                    {restaurants.restaurants.map((restaurant) =>
                        <>

                            <Card variant="outlined" sx={{
                                textAlign: "center",
                            }}>
                                <CardContent>
                                    <Typography variant="h4" >{restaurant.name}</Typography>
                                    <Typography>Adresse : {restaurant.address} à {restaurant.city}</Typography>
                                    <Typography>{restaurant.is_open === true ? "Ouvert" : "Fermé"}</Typography>
                                    <Typography>Horaires d'ouverture : {restaurant.opening_hours}</Typography>
                                    <Typography>Tél : {restaurant.contact}</Typography>
                                </CardContent>
                            </Card >
                        </>
                    )}  </Stack>

            </Container >
        </>)
}

export default App;
