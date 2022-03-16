import React from "react";

type ColorScheme = "light" | "dark";

const AppContext = React.createContext({
  scheme: "light" as ColorScheme,
  setScheme: (scheme: ColorScheme) => {},
});

export default AppContext;
