import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';


function App() {
    const restaurants = useSelector((state: RootState) => state.restaurants)
    const aujourdhui = new Date(Date.now())
    const heureAujourdhui = aujourdhui.getHours()

    const verifHoraires = (horaires: string | null) => {
        if (!horaires) {
            return false
        }

        let horairesFermeture = Number(horaires.slice(-3, -1))
        let horairesOuverture = Number(horaires.slice(0, 2))

        if (horairesFermeture == 0) {
            horairesFermeture = 24
        }

        if (heureAujourdhui < horairesFermeture && heureAujourdhui >= horairesOuverture) {
            return true
        } else {
            return false
        }
    }

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
                                    <Typography>
                                        <CircleIcon
                                            sx={{
                                                fontSize: 10, color: verifHoraires(restaurant.opening_hours) ? "success.main" : "error.main"
                                                , mr: 1,
                                            }} />{verifHoraires(restaurant.opening_hours) ?
                                                "Ouvert"
                                                :
                                                "Fermé"
                                        }</Typography>
                                    <Typography>Horaires d'ouverture : {restaurant.opening_hours}</Typography>
                                    <Typography>Tél : {restaurant.contact}</Typography>
                                </CardContent>
                            </Card >
                        </>
                    )}  </Stack>

            </Container >
        </>
    )
}

export default App;
