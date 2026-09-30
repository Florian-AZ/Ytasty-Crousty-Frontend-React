import { useEffect, useMemo, useState, type ReactNode, } from "react";
import { CssBaseline, ThemeProvider, type PaletteMode, } from "@mui/material";
import { AppTheme } from "./theme";
import { ColorModeContext } from "./colormodecontext";

type ColorModeProviderProps = {
  children: ReactNode;
};

function getInitialMode(): PaletteMode {
  const savedMode = localStorage.getItem("ytasty-color-mode");

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  return prefersDarkMode ? "dark" : "light";
}

export default function ColorModeProvider({
  children,
}: ColorModeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  const theme = useMemo(() => AppTheme(mode), [mode]);

  const colorMode = useMemo(
    () => ({
      mode,

      toggleColorMode: () => {
        setMode((currentMode) =>
          currentMode === "light" ? "dark" : "light",
        );
      },
    }),
    [mode],
  );

  useEffect(() => {
    localStorage.setItem("ytasty-color-mode", mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}