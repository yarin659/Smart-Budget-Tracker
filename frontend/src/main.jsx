// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import { GoalsProvider } from "./context/GoalsContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TransactionsProvider>
        <GoalsProvider>
          <App />
        </GoalsProvider>
      </TransactionsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
