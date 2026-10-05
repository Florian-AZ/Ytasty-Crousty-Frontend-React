import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import YTastyCroustyAix from "../assets/YTastyCroustyAix.png";
import YTastyCroustyLyon from "../assets/YTastyCroustyLyon.png";
import YTastyCroustyParis from "../assets/YTastyCroustyParis.png";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const restaurants = useSelector((state: RootState) => state.restaurants);
  const aujourdhui = new Date(Date.now());
  const heureAujourdhui = aujourdhui.getHours();

  const photoRestaurant = (nomRestaurant: string | null) => {
    if (nomRestaurant === "Ytasty Crousty Aix") {
      return YTastyCroustyAix;
    }
    if (nomRestaurant === "Ytasty Crousty Lyon") {
      return YTastyCroustyLyon;
    }
    if (nomRestaurant === "Ytasty Crousty Paris") {
      return YTastyCroustyParis;
    }
  };

  const verifHoraires = (horaires: string | null) => {
    if (!horaires) {
      return false;
    }

    let horairesFermeture = Number(horaires.slice(-3, -1));
    let horairesOuverture = Number(horaires.slice(0, 2));

    if (horairesFermeture == 0) {
      horairesFermeture = 24;
    }

    if (
      heureAujourdhui < horairesFermeture &&
      heureAujourdhui >= horairesOuverture
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Container
        sx={{
          pt: 16,
          pb: 6,
        }}
      >
        <Stack spacing={2}>
          {restaurants.restaurants.map((restaurant) => (
            <>
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  textAlign: "center",
                }}
              >
                <img
                  src={photoRestaurant(restaurant.name)}
                  alt={`Photo du ${restaurant.name}`}
                  style={{
                    width: "55%",
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    width: "45%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">{restaurant.name}</Typography>{" "}
                  <Typography>
                    Adresse : {restaurant.address} à {restaurant.city}
                  </Typography>{" "}
                  <Typography>
                    {" "}
                    <CircleIcon
                      sx={{
                        fontSize: 10,
                        color: verifHoraires(restaurant.opening_hours)
                          ? "success.main"
                          : "error.main",
                        mr: 1,
                      }}
                    />
                    {verifHoraires(restaurant.opening_hours)
                      ? "Ouvert"
                      : "Fermé"}
                  </Typography>{" "}
                  <Typography>
                    Horaires d'ouverture : {restaurant.opening_hours}
                  </Typography>{" "}
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 17 }} />
                    Tél : {restaurant.contact}
                  </Typography>
                  <Button
                    onClick={() =>
                      navigate(`/produits?restaurant=${restaurant.id}`)
                    }
                    variant="contained"
                    //disabled={!verifHoraires(restaurant.opening_hours)}
                    sx={{ mt: 2 }}
                  >
                    Commander
                  </Button>
                </CardContent>
              </Card>
            </>
          ))}{" "}
        </Stack>
      </Container>
    </>
  );
}

export default App;
