// ===== Logic =====
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");

    // ===== Live validation =====
    if (name === "email") {
      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "אימייל לא תקין",
        }));
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "הסיסמה חייבת לפחות 6 תווים",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("1) handleSubmit STARTED");
  console.log("2) form:", form);

  setGeneralError("");

  let valid = true;
  const newErrors = { email: "", password: "" };

  if (!form.email) valid = false;
  if (!form.password) valid = false;

  setErrors(newErrors);
  if (!valid) {
    console.log("3) Validation FAILED");
    return;
  }

  console.log("3) Validation PASSED");

  try {
    console.log("4) Sending fetch...");

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log("5) fetch result", res);

    if (!res.ok) {
      console.log("6) Server returned NOT OK");
      setGeneralError("אימייל או סיסמה שגויים");
      return;
    }

    const data = await res.json();
    console.log("7) Server data:", data);

    login({ token: data.token, userId: data.id });
    console.log("8) LOGIN SUCCESS → navigating");

    navigate("/");

  } catch (err) {
    console.log("ERR", err);
    setGeneralError("שגיאה בהתחברות לשרת");
  }
};



  return (
    <Wrapper>
      <Card>
        <h2>Login</h2>

        {generalError && <GeneralError>{generalError}</GeneralError>}

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputWrapper>

          <InputWrapper>
            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputWrapper>

          <button type="submit">Login</button>
        </form>

        <SmallText>
          אין לך משתמש?{" "}
          <StyledLink to="/register">הירשם כאן</StyledLink>
        </SmallText>
      </Card>
    </Wrapper>
  );
}

// ===== Styling =====
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 0px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 30px 25px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  box-shadow: 0 0 12px rgba(0,0,0,0.05);
  text-align: center;

  h2 {
    margin-bottom: 20px;
  }

  button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border-radius: 8px;
    border: none;
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.85;
    }
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 12px;

  input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ErrorText = styled.div`
  margin-top: 4px;
  font-size: 0.85rem;
  color: #ff4d4d;
  text-align: left;
`;

const GeneralError = styled.div`
  margin-bottom: 12px;
  background: #ffdddd;
  color: #b30000;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ffb3b3;
`;

const SmallText = styled.p`
  margin-top: 15px;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
