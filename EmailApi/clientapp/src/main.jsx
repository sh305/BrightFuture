import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import "./styles.css";
const theme=createTheme({palette:{primary:{main:"#1565c0"},secondary:{main:"#ff6f00"},background:{default:"#f6f8fb"}},typography:{fontFamily:"Inter, Arial, sans-serif",h1:{fontWeight:800},h2:{fontWeight:800},h3:{fontWeight:700}}});
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><BrowserRouter><App/></BrowserRouter></ThemeProvider></React.StrictMode>);