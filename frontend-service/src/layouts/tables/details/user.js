import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { IconButton, Grid, Card, Typography, List, ListItem, ListItemText } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { extractDeviceName } from "../helper";

function PolicyDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const device = location.state.device; // Device data passed via route state

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <IconButton onClick={() => navigate(-1)} aria-label="go back">
          <ArrowBack /> Back
        </IconButton>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <Typography variant="h4" gutterBottom>
                  Device Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Policy Details</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="name"
                          secondary={extractDeviceName(device.name)}
                        />
                      </ListItem>

                      {device?.applications?.map((policy, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                            primary="Package Name"
                            secondary={policy.packageName}
                          />
                          <ListItemText
                            primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                            primary="Install Type"
                            secondary={policy.installType}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default PolicyDetail;
