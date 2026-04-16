import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";
import FoodBackground from "./components/FoodBackground";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FoodBackground />
      <Navbar />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
