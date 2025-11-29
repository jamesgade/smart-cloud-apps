import { ThemeProvider } from "@mui/material/styles";
// import { RefineThemes } from "@refinedev/mui";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { SESLightTheme } from "../../theme";
import { ACCESS_TOKEN_KEY, COLOR_MODE_KEY } from "../../libs/constants";

type ColorModeContextType = {
  mode: string;
  toggleMode: () => void;
};

const getColorModeFromAPI = async () : Promise<'light' | 'dark' | any> => {
  // PENDING : Replace with actual API call
  // return 'dark';
  return localStorage.getItem(COLOR_MODE_KEY);
};

const getSystemPreferenceColorMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const handleColorMode = async (isAuthenticated: boolean) => {
  let colorMode = localStorage.getItem(COLOR_MODE_KEY);
  if (isAuthenticated) {
    const apiColorMode = await getColorModeFromAPI();
    if (colorMode !== apiColorMode) {
      localStorage.setItem(COLOR_MODE_KEY, apiColorMode);
      colorMode = apiColorMode;
    }
  } else {
    if (!colorMode) {
      colorMode = getSystemPreferenceColorMode();
      localStorage.setItem(COLOR_MODE_KEY, colorMode);
    }
  }
  return colorMode;
};

const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem(COLOR_MODE_KEY);
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    const updateColorMode = async () => {
      const isAuthenticated = localStorage.getItem(ACCESS_TOKEN_KEY) ? true : false;
      const colorMode = await handleColorMode(isAuthenticated);
      setMode(colorMode as string);
    }
    updateColorMode();
  }, [])

  useEffect(() => {
    window.localStorage.setItem(COLOR_MODE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <ColorModeContext.Provider
      value={{
        toggleMode,
        mode,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        // theme={mode === "light" ? RefineThemes.Blue : RefineThemes.BlueDark}
        // theme={SESLightTheme}
        // theme={mode === "light" ? SESLightTheme : SESDarkTheme}
        theme={SESLightTheme}
      >
          {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export { ColorModeContext, ColorModeContextProvider };
