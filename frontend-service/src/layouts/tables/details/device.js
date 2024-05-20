import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

import { IconButton, Grid, Card, Typography, List, ListItem, ListItemText } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { extractDeviceName } from "../helper";

function DeviceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const device = location.state.device; // Assuming the device data is passed via route state

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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">General Info</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="API Level"
                          secondary={device.apiLevel}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Policy Name"
                          secondary={extractDeviceName(device.appliedPolicyName)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Policy Version"
                          secondary={device.appliedPolicyVersion}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="State"
                          secondary={device.appliedState}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Enrollment Time"
                          secondary={device.enrollmentTime}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Device Name"
                          secondary={extractDeviceName(device.name)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Ownership"
                          secondary={device.ownership}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Policy Compliance"
                          secondary={device.policyCompliant ? "Compliant" : "Non-Compliant"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="User Name"
                          secondary={extractDeviceName(device.userName)}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Hardware Info</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Brand"
                          secondary={device.hardwareInfo.brand}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Model"
                          secondary={device.hardwareInfo.model}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Hardware"
                          secondary={device.hardwareInfo.hardware}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Serial Number"
                          secondary={device.hardwareInfo.serialNumber}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Baseband Version"
                          secondary={device.hardwareInfo.deviceBasebandVersion}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Manufacturer"
                          secondary={device.hardwareInfo.manufacturer}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">Memory Info</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="Internal Storage"
                          secondary={`${(
                            device.memoryInfo.totalInternalStorage /
                            1024 /
                            1024 /
                            1024
                          ).toFixed(2)} GB`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
                          primary="RAM"
                          secondary={`${(device.memoryInfo.totalRam / 1024 / 1024 / 1024).toFixed(
                            2
                          )} GB`}
                        />
                      </ListItem>
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

export default DeviceDetails;
