import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";

import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import App from "./App";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThirdwebProvider activeChain="ethereum">
    <Router>
      <App />
    </Router>
  </ThirdwebProvider>
);
