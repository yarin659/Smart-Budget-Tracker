import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "./styles/theme";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Inter", sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Navbar יוצג רק אם יש משתמש */}
      {user && <NavBar />}

      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {user && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
