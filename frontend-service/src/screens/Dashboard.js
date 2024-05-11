import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";
import PolicyIcon from "@mui/icons-material/Policy";
import SecurityIcon from "@mui/icons-material/Security";
import ComplianceIcon from "@mui/icons-material/AssignmentTurnedIn";
import Chart from "chart.js/auto";
import { extractDeviceName } from "../helpers";
import { Container } from '@mui/material';

const Dashboard = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deviceResponse, policyResponse] = await Promise.all([
        fetch("api1/mdm/device").then((response) => response.json()),
        fetch("api3/mdm/policy").then((response) => response.json()),
      ]);

      setDeviceData(deviceResponse.data);
      setPolicyData(policyResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Calculate active devices count
  const activeDevicesCount = deviceData?.filter(
    (device) => device.state === "ACTIVE"
  )?.length;

  // Calculate device brands data
  const deviceBrands = {};
  deviceData?.forEach((device) => {
    deviceBrands[device.hardwareInfo.brand] =
      (deviceBrands[device.hardwareInfo.brand] || 0) + 1;
  });

  const brandChartData = {
    labels: Object.keys(deviceBrands),
    datasets: [
      {
        label: "Devices by Brand",
        backgroundColor: ["#2196F3", "#4CAF50", "#FFC107", "#FF5722"],
        data: Object.values(deviceBrands),
      },
    ],
  };

  // Calculate device ownership data
  const deviceOwnership = {};
  deviceData?.forEach((device) => {
    deviceOwnership[device.ownership] =
      (deviceOwnership[device.ownership] || 0) + 1;
  });

  const ownershipChartData = {
    labels: Object.keys(deviceOwnership),
    datasets: [
      {
        label: "Device Ownership",
        backgroundColor: ["#FF6384", "#36A2EB"],
        data: Object.values(deviceOwnership),
      },
    ],
  };

  // Calculate applied policies data
  const appliedPolicies = {};
  policyData?.forEach((policy) => {
    appliedPolicies[extractDeviceName(policy.name)] =
      (appliedPolicies[extractDeviceName(policy.name)] || 0) + 1;
  });

  const policiesChartData = {
    labels: Object.keys(appliedPolicies),
    datasets: [
      {
        label: "Applied Policies",
        backgroundColor: "#2196F3",
        data: Object.values(appliedPolicies),
      },
    ],
  };

  // Calculate device compliance data
  const compliantDevicesCount = deviceData?.filter(
    (device) => device?.policyCompliant
  )?.length;
  const nonCompliantDevicesCount = deviceData?.length - compliantDevicesCount;

  const complianceChartData = {
    labels: ["Compliant Devices", "Non-Compliant Devices"],
    datasets: [
      {
        data: [compliantDevicesCount, nonCompliantDevicesCount],
        backgroundColor: ["#4CAF50", "#FF5722"],
      },
    ],
  };

  // Calculate security posture data
  const secureDevicesCount = deviceData?.filter(
    (device) => device.securityPosture.devicePosture === "SECURE"
  )?.length;
  const nonSecureDevicesCount = deviceData?.length - secureDevicesCount;

  const securityChartData = {
    labels: ["Secure Devices", "Non-Secure Devices"],
    datasets: [
      {
        data: [secureDevicesCount, nonSecureDevicesCount],
        backgroundColor: ["#4CAF50", "#FF5722"],
      },
    ],
  };

  // Calculate total RAM and internal storage
  const totalRAM = deviceData?.reduce(
    (acc, device) =>
      acc + Math.round(parseInt(device.memoryInfo.totalRam) / 1e9),
    0
  );
  const totalStorage = deviceData?.reduce(
    (acc, device) =>
      acc + Math.round(parseInt(device.memoryInfo.totalInternalStorage) / 1e9),
    0
  );

  return (

<Container maxWidth="lg" >
  <Grid container spacing={2} marginTop={5}>
    {loading ? (
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    ) : (
      <>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Ownership
              </Typography>
              <StorageIcon />
              <Doughnut data={ownershipChartData} options={{ maintainAspectRatio: true, aspectRatio: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Applied Policies
              </Typography>
              <PolicyIcon />
              <Doughnut data={policiesChartData} options={{ maintainAspectRatio: true, aspectRatio: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Status
              </Typography>
              <ComplianceIcon />
              <Doughnut data={complianceChartData} options={{ maintainAspectRatio: true, aspectRatio: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Posture
              </Typography>
              <SecurityIcon />
              <Doughnut data={securityChartData} options={{ maintainAspectRatio: true, aspectRatio: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Devices by Brand
              </Typography>
              <DevicesIcon />
              <Bar data={brandChartData} options={{ maintainAspectRatio: true, aspectRatio: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total RAM
              </Typography>
              <Typography variant="h6">
                {totalRAM} GB
              </Typography>
            </CardContent>
          </Card>
          <br />
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Internal Storage
              </Typography>
              <Typography variant="h6">
                {totalStorage} GB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}></Grid>
      </>
    )}
  </Grid>
</Container>

  );
};

export default Dashboard;
