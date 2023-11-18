import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "../../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import {
  TextField,
  Button,
  Paper,
  Box,
  Tooltip,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import "./Signup.scss";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetAllInputs = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLastName("");
    setConfirmPassword("");
    setUsername("");
  };

  const isEmailValid = (email) => {
    if (email.length === 0) return true;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const saveUserDataToFirestore = async (userData) => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    await addDoc(usersCollectionRef, userData);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (
      !email ||
      password !== confirmPassword ||
      !password ||
      !confirmPassword ||
      !name ||
      !lastName ||
      !username
    ) {
      toast.error("Debe llenar todos los campos", { autoClose: 3000 });
      return;
    }

    try {
      const usersCollectionRef = collection(db, "users");
      const emailQuery = query(usersCollectionRef, where("email", "==", email));
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (!emailQuerySnapshot.empty) {
        toast.error("Este usuario ya está registrado", { autoClose: 3000 });
        navigate("/login");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await saveUserDataToFirestore({
        uid: user.uid,
        name,
        lastName,
        username,
        email,
      });

      resetAllInputs();
      toast.success(`Usuario registrado con éxito`, {
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${error.message}`, { autoClose: 3000 });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error(`El usuario ya se encuentra registrado`, {
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }
      const [nombre, apellido] = user.displayName.split(" ");

      const userData = {
        id: user.uid,
        name: nombre,
        lastName: apellido,
        username: user.email,
        email: user.email,
      };

      try {
        await addDoc(usersCollectionRef, userData);
        resetAllInputs();
        navigate("/login");
      } catch (error) {
        throw error;
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="signup-container">
      <Box component="form" width="50%" mx="auto">
        <Paper elevation={3} className="signup-container">
          <Typography variant="h5" component="div" className="signup-label">
            Sign up
          </Typography>
          <TextField
            className="name-field"
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            margin="normal"
            autoComplete="off"
            required
          />
          <TextField
            className="last-name-field"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={handleLastNameChange}
            margin="normal"
            autoComplete="off"
            required
          />
          <TextField
            className="username-field"
            label="Userame"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            margin="normal"
            autoComplete="off"
            required
          />
          <Tooltip title="Ejemplo: email@domain.com" arrow followCursor>
            <TextField
              className="email-field"
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error={!isEmailValid(email)}
              helperText={!isEmailValid(email) && "Formato inválido"}
              margin="normal"
              autoComplete="off"
              required
            />
          </Tooltip>
          <TextField
            className="password-field"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            className="confirm-password-field"
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            margin="normal"
            autoComplete="off"
            error={!!confirmPassword && confirmPassword !== password}
            helperText={
              confirmPassword && confirmPassword !== password
                ? "Passwords do not match"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPassword}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />

          <Button
            className="signup-button"
            variant="contained"
            color="primary"
            onClick={handleSignup}
          >
            Sign up
          </Button>
          <div className="google-signup-container">
            <span>or</span>
            <Button
              className="google-signup-button"
              variant="contained"
              color="secondary"
              onClick={handleGoogleSignup}
            >
              Sign up with Google
            </Button>
          </div>
          <p>
            Already have an account? <NavLink to="/login">Login</NavLink>
          </p>
        </Paper>
      </Box>
    </div>
  );
};

export default Signup;
