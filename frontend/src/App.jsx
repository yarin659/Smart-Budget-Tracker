import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "./styles/theme";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import { TransactionsProvider } from "./context/TransactionsContext";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Inter", sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TransactionsProvider>
        <GlobalStyle />
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </TransactionsProvider>
    </ThemeProvider>
  );
}
