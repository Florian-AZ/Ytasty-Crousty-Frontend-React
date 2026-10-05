import { IconButton } from "@mui/material";

import { useColorMode } from "../theme/colormodecontext";

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();

  const isDark = mode === "dark";

  return (
    <IconButton
      color="secondary"
      onClick={toggleColorMode}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      size="small"
    >
      {isDark ? "☀️" : "🌙"}
    </IconButton>
  );
}
