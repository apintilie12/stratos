import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark", // Change this to "light" for light mode
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#121212", // Dark mode background
            paper: "#1e1e1e", // Card background
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0bec5",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});

export default theme;