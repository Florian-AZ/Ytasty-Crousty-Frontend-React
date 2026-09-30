import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { buttonClasses } from "@mui/material/Button";

export function AppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#D80808",
        light: "#F81828",
        dark: "#980606",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#F8C808",
        light: "#F8D808",
        dark: "#F88808",
        contrastText: "#280808",
      },

      background: {
        default: isDark ? "#140404" : "#FFF8E8",
        paper: isDark ? "#280808" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#FFF8E8" : "#280808",
        secondary: isDark ? "#E7BDB5" : "#6B4A42",
      },

      divider: isDark
        ? "rgba(248, 200, 8, 0.20)"
        : "rgba(40, 8, 8, 0.14)",

      success: {
        main: isDark ? "#66BB6A" : "#2E7D32",
      },

      warning: {
        main: "#F88808",
      },

      error: {
        main: isDark ? "#FF6B78" : "#B00020",
      },

      info: {
        main: isDark ? "#64B5F6" : "#1976D2",
      },
    },

    typography: {
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

      h1: {
        fontFamily: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
        fontSize: "3rem",
        fontWeight: 900,
        lineHeight: 1.1,
      },

      h2: {
        fontFamily: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
        fontSize: "2.25rem",
        fontWeight: 800,
        lineHeight: 1.2,
      },

      h3: {
        fontSize: "1.5rem",
        fontWeight: 800,
      },

      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },

      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },

      button: {
        fontWeight: 800,
        textTransform: "none",
      },
    },

    shape: {
      borderRadius: 14,
    },

    spacing: 8,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition:
              "background-color 200ms ease, color 200ms ease",
          },

          "*": {
            boxSizing: "border-box",
          },

          img: {
            display: "block",
            maxWidth: "100%",
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 999,
            padding: "10px 24px",
            fontWeight: 800,

            // Bouton variant="contained" color="primary"
            [`&.${buttonClasses.contained}.${buttonClasses.colorPrimary}`]: {
              color: "#FFFFFF",
              background:
                "linear-gradient(135deg, #F81828 0%, #D80808 100%)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #D80808 0%, #980606 100%)",
              },

              [`&.${buttonClasses.disabled}`]: {
                color: isDark ? "#B8BAC5" : "#817B78",
                background: isDark ? "#30313A" : "#DDD8D3",
              },
            },

            // Bouton variant="contained" color="secondary"
            [`&.${buttonClasses.contained}.${buttonClasses.colorSecondary}`]: {
              color: "#280808",
              background:
                "linear-gradient(135deg, #F8D808 0%, #F8B808 100%)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #F8C808 0%, #F88808 100%)",
              },
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            border: isDark
              ? "1px solid rgba(248, 200, 8, 0.18)"
              : "1px solid rgba(40, 8, 8, 0.10)",

            borderRadius: 18,

            boxShadow: isDark
              ? "0 10px 30px rgba(0, 0, 0, 0.35)"
              : "0 10px 30px rgba(40, 8, 8, 0.10)",

            backgroundImage: "none",
          },
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },

        styleOverrides: {
          root: {
            color: "#FFFFFF",
            backgroundColor: isDark ? "#1C0505" : "#280808",
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D80808",
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 700,
          },
        },
      },
    },
  });
}
