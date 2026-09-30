import { createContext, useContext } from "react";
import type { PaletteMode } from "@mui/material";

type ColorValue = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

export const ColorModeContext =
  createContext<ColorValue | undefined>(undefined);

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error(
      "useColorMode doit être utilisé dans ColorModeProvider",
    );
  }

  return context;
}