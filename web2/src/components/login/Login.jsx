import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";
import { UserContext } from "../../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setLogged = useContext(UserContext);

  const navigate = useNavigate();

  const resetAllInputs = () => {
    setEmail("");
    setPassword("");
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Debe ingresar todos los datos", {
        autoClose: 3000,
      });
      return;
    } else if (!isEmailValid(email)) {
      toast.error("Formato inválido", {
        autoClose: 3000,
      });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore();
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const confirmed = window.confirm(
          "Usuario no registrado. Redireccionar a Registro de Usuarios?"
        );
        if (confirmed) {
          navigate("/signup");
          return;
        }
      } else {
        resetAllInputs();
        toast.success("Loggeado", {
          autoClose: 3000,
        });
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isLogged", "true");
        setLogged(true);
      }
    } catch (error) {
      toast.error("Usuario Inválido", { autoClose: 3000 });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const db = getFirestore();
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Usuario no encontrado", { autoClose: 3000 });
      } else {
        resetAllInputs();
        toast.success("Loggeado con Google", {
          autoClose: 3000,
        });
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isLogged", "true");

        setLogged(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error de login con Google", { autoClose: 3000 });
    }
  };
  return (
    <div className="login-container">
      <Box width="50%" mx="auto">
        <Paper elevation={3} className="login-container">
          <Typography variant="h5" component="div" className="login-label">
            Login
          </Typography>
          <Tooltip title="Ejemplo: email@domain.com" arrow followCursor>
            <TextField
              className="email-field"
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              required
            />
          </Tooltip>
          <TextField
            className="password-field"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <Button
            className="login-button"
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
          <div className="google-login-container">
            <span>or</span>
            <Button
              className="google-login-button"
              variant="contained"
              color="secondary"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </div>
          <p>
            Create an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </Paper>
      </Box>
    </div>
  );
};

export default Login;
