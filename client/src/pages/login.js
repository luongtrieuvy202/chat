import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { useNavigate, Link, Navigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

export default function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  });

  const handlerChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;

    if (username === "") {
      toast.error("Username must not be empty", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters", toastOptions);
      return false;
    }

    return true;
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }

        if (data.status === true) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (e) {
        toast.error("Failed connecting to the server", toastOptions);
      }
    } else {
      toast.error("Something went wrong", toastOptions);
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(e) => handlerSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Ping</h1>
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => handlerChange(e)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => handlerChange(e)}
          />

          <button type="submit">Login</button>
          <span>
            Doesn't have an account ?<Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    width: 40%;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    width: 100%;
    padding: 1rem 2rem;
    border: 0.1rem solid #997af0;
    border-radius: 0.4rem;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    &:active {
      box-shadow: 2px 2px 5px #4e0eff;
    }
  }

  span {
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    text-transform: uppercase;
    a {
      text-decoration: none;
    }
  }
`;
