// ===== Logic =====
import { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  // Validation rules
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Live validation
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
          password: "הסיסמה חייבת לכלול לפחות 6 תווים",
        }));
      }
      if (form.confirm && value !== form.confirm) {
        setErrors((prev) => ({
          ...prev,
          confirm: "הסיסמאות אינן תואמות",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirm: "" }));
      }
    }

    if (name === "confirm") {
      if (value !== form.password) {
        setErrors((prev) => ({
          ...prev,
          confirm: "הסיסמאות אינן תואמות",
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "", confirm: "" };

    if (!form.email) {
      valid = false;
      newErrors.email = "נא להזין אימייל";
    } else if (!validateEmail(form.email)) {
      valid = false;
      newErrors.email = "אימייל לא תקין";
    }

    if (!form.password) {
      valid = false;
      newErrors.password = "נא להזין סיסמה";
    } else if (form.password.length < 6) {
      valid = false;
      newErrors.password = "הסיסמה חייבת לכלול לפחות 6 תווים";
    }

    if (!form.confirm) {
      valid = false;
      newErrors.confirm = "נא להזין אישור סיסמה";
    } else if (form.confirm !== form.password) {
      valid = false;
      newErrors.confirm = "הסיסמאות אינן תואמות";
    }

    setErrors(newErrors);
    if (!valid) return;

    alert("נרשמת בהצלחה!");
    navigate("/login");
  };

  return (
    <Wrapper>
      <Card>
        <h2>Register</h2>

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

          <InputWrapper>
            <input
              name="confirm"
              placeholder="Confirm Password"
              type="password"
              onChange={handleChange}
            />
            {errors.confirm && <ErrorText>{errors.confirm}</ErrorText>}
          </InputWrapper>

          <button type="submit">Register</button>
        </form>

        <SmallText>
          כבר יש לך משתמש?{" "}
          <StyledLink to="/login">התחבר כאן</StyledLink>
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
