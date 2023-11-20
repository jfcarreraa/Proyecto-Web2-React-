import React, { useContext, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserContext } from "../../App";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navigation = () => {
  const setLogged = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLogged(false);
    handleMenuClose();
  };

  return (
    <div className="navbar-container">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              marginLeft: "20px",
            }}
          >
            Posts
          </Typography>
          <Typography
            variant="h6"
            component={Link}
            to="/admin"
            style={{
              textDecoration: "none",
              color: "inherit",
              marginLeft: "20px",
            }}
          >
            Admin
          </Typography>
          <div style={{ flexGrow: 1 }} />{" "}
          {userData && (
            <>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Welcome {userData.name} 👋
              </Typography>
              <IconButton
                size="large"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  );
};

export default Navigation;
