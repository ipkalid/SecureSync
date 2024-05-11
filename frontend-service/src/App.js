import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Grid,
  AppBar,
  Drawer,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import Dashboard from "./screens/Dashboard";
import DeviceManagement from "./screens/DeviceManagement";
import PolicyManagement from "./screens/PolicyManagement";
import DeviceTracking from "./screens/DeviceTracking";
import OrderList from "./screens/OrderList";
import ProductStock from "./screens/ProductStock";
import Settings from "./screens/Settings";
import LogOff from "./screens/LogOff";
import LoginForm from "./screens/LoginForm";
import SignupForm from "./screens/SignupForm";
import PasswordResetForm from "./screens/PasswordResetForm";
import NavBar from "./screens/Navbar";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeviceHubIcon from "@mui/icons-material/DeviceHub"; // Replace with actual icon for Device Management
import PolicyIcon from "@mui/icons-material/Policy"; // Replace with actual icon for Policy Management
import TrackChangesIcon from "@mui/icons-material/TrackChanges"; // Replace with actual icon for Device Tracking
import ListAltIcon from "@mui/icons-material/ListAlt"; // Replace with actual icon for Order List
import InventoryIcon from "@mui/icons-material/Inventory";
import { blue, green } from "@mui/material/colors";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LandingPage from "./screens/LandingPage";
const drawerWidth = 240;

const theme = createTheme({
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
});

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const token = localStorage.getItem("token");

  const handleLogin = (credentials) => {
    // handle login
  };

  const handleSignup = (credentials) => {
    // handle signup
  };

  const handlePasswordReset = (email) => {
    // handle password reset
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Grid container>
          <Grid item xs={12}>
            <NavBar />
          </Grid>

          {token && (
            <Grid item xs={2}>
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#212121", // Drawer background color
                    color: "white", // Text color
                  },
                }}
              >
                <Toolbar sx={{ backgroundColor: blue[700], color: "white" }}>
                  <Typography variant="h6" noWrap component="div">
                    SecureSync
                  </Typography>
                </Toolbar>
                <List>
                  {[
                    "Dashboard",
                    "Device Management",
                    "Policy Management",
              
                  ].map((text, index) => (
                    <ListItem
                      button
                      key={text}
                      component={NavLink}
                      to={`/${text.toLowerCase().replace(/\s+/g, "-")}`}
                      sx={{ "&.active": { backgroundColor: blue[500] } }}
                    >
                      <ListItemIcon>
                        {/* You will replace this switch statement with the actual icons you want to use */}
                        {index === 0 && (
                          <DashboardIcon sx={{ color: "white" }} />
                        )}
                        {index === 1 && (
                          <DeviceHubIcon sx={{ color: "white" }} />
                        )}
                        {index === 2 && <PolicyIcon sx={{ color: "white" }} />}
                        {index === 3 && (
                          <InventoryIcon sx={{ color: "white" }} />
                        )}
                        {index === 4 && (
                          <SettingsIcon sx={{ color: "white" }} />
                        )}
                        {/* ... other icons */}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Grid>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LandingPage />
                </div>
              }
            />

            <Route
              path="/login"
              element={
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoginForm onLogin={handleLogin} />
                </div>
              }
            />
            <Route
              path="/signup"
              element={
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SignupForm onSignup={handleSignup} />
                </div>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PasswordResetForm onPasswordReset={handlePasswordReset} />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/device-management"
              element={
                <PrivateRoute>
                  <DeviceManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/device-tracking"
              element={
                <PrivateRoute>
                  <DeviceTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/policy-management"
              element={
                <PrivateRoute>
                  <PolicyManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-list"
              element={
                <PrivateRoute>
                  <OrderList />
                </PrivateRoute>
              }
            />
            <Route
              path="/product-stock"
              element={
                <PrivateRoute>
                  <ProductStock />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/logoff"
              element={
                <PrivateRoute>
                  <LogOff />
                </PrivateRoute>
              }
            />
          </Routes>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}

export default App;
