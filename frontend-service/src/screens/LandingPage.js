import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { blue } from "@mui/material/colors";

const LandingPage = () => {
  return (
    <Box
    
  
    >


      <Grid container spacing={3} sx={{ mt: 10 }}>
        {/* Hero Section */}
        <Grid item xs={12}>
          <Box textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to SecureSync
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              Your comprehensive Android MDM solution
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/signup"
              sx={{ bgcolor: blue[500], color: "white" }}
            >
              Get Started
            </Button>
          </Box>
        </Grid>


        {/* About Section */}
       
        <Grid item xs={12} style={{textAlign:'center',marginTop:50}}>
          <Typography variant="h4" component="h2" gutterBottom>
            About SecureSync
          </Typography>
          <Typography variant="body1" paragraph>
            SecureSync is a powerful Android MDM solution designed to streamline
            device management and enhance security for organizations of all
            sizes.
          </Typography>
          <Typography variant="body1" paragraph>
            With SecureSync, you can easily manage devices, enforce security
            policies, track device usage, and much more.
          </Typography>
        </Grid>

    
      </Grid>
    </Box>
  );
};

export default LandingPage;
