import { Box, Container } from "@mui/material";

function App() {
    return (
        <Box
            component="main"
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                pt: { xs: 14, md: 18 },
                pb: 8,
            }}
        >
            <Container maxWidth="lg">
            </Container>
        </Box>
    )
}

export default App;
