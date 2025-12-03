// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import { GoalsProvider } from "./context/GoalsContext.jsx";
import { InsightsProvider } from "./context/InsightsContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionsProvider>
          <GoalsProvider>
            <InsightsProvider>
              <App />
            </InsightsProvider>
          </GoalsProvider>
        </TransactionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
