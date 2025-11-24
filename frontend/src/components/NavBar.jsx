// ===== Logic =====
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { FiMenu, FiX } from "react-icons/fi"; 
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <Bar>
      <Brand to="/">SBT</Brand>

      <Right>
        <Button to="/transactions">Transactions</Button>
        <Button to="/dashboard">Dashboard</Button>
        <Button to="/goals">Goals</Button>
        <Button to="/insights">Insights</Button>

        {/* === Auth Buttons (Desktop) === */}
        {!user ? (
          <>
            <Button to="/login">Login</Button>
            <Button to="/register">Register</Button>
          </>
        ) : (
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        )}
      </Right>

      <MenuButton onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </MenuButton>

      {open && (
        <MobileMenu onClick={() => setOpen(false)}>
          <Link to="/transactions">Transactions</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/goals">Goals</Link>     
          <Link to="/insights">Insights</Link>

          {/* === Auth Buttons (Mobile) === */}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <LogoutMobile onClick={logout}>Logout</LogoutMobile>
          )}
        </MobileMenu>
      )}
    </Bar>
  );
};

export default NavBar;

// ===== Styling =====

const Bar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Brand = styled(Link)`
  text-decoration: none;
  font-weight: 700;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.5px;
`;

const Right = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled(Link)`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const LogoutButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  width: 170px;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {opacity: 0; transform: translateY(-5px);}
    to {opacity: 1; transform: translateY(0);}
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
    padding: 10px 20px;
    transition: 0.2s;
    &:hover {
      background: ${({ theme }) => theme.colors.card};
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const LogoutMobile = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
