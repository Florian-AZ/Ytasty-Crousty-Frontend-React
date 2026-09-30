import { Button } from "@mui/material";

import { useColorMode } from "../theme/colormodecontext";

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();

  const isDark = mode === "dark";

  return (
    <Button
      color="secondary"
      variant="contained"
      onClick={toggleColorMode}
      aria-label={
        isDark
          ? "Activer le mode clair"
          : "Activer le mode sombre"
      }
    >
      {isDark ? "☀️ Mode clair" : "🌙 Mode sombre"}
    </Button>
  );
}