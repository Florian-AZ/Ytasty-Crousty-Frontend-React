import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
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
import { ListItemButton, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
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
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Link to={"/"}>
              <Logo height={50} width={75} />
            </Link>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button variant="text" color="primary" size="small">
                Nos Restaurants
              </Button>
              <Button variant="text" color="primary" size="small">
                Nos Plats
              </Button>
              <Button variant="text" color="primary" size="small">
                Commander
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
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
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
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
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <ListItemButton> Nos Plats</ListItemButton>
                <ListItemButton>Commander</ListItemButton>
                <Divider sx={{ my: 3 }} />
                <ListItemButton>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </ListItemButton>
                <ListItemButton>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </ListItemButton>
                <MenuItem>
                  {user ? (
                    <Button
                      component={Link}
                      to="/back-office"
                      color="secondary"
                      variant="contained"
                      fullWidth
                      onClick={toggleDrawer(false)}
                    >
                      Profil
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
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
