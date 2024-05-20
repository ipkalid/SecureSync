/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Card } from "@mui/material";

function aggregateDevicesByBrand(devices) {
  // Object to hold brand counts
  const brandCounts = {};

  // Process each device to count brands
  devices.forEach((device) => {
    const brand = device.hardwareInfo.brand;
    if (brandCounts[brand]) {
      brandCounts[brand] += 1;
    } else {
      brandCounts[brand] = 1;
    }
  });

  // Prepare data for the chart
  const labels = Object.keys(brandCounts);
  const data = Object.values(brandCounts);

  // Create the dataset for the chart
  const datasets = {
    label: "Device Count by Brand",
    data: data,
  };

  // Return both labels and datasets
  return { labels, datasets };
}
function processData(data) {
  // Define labels for the days of the week
  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  // Initialize an array to hold the counts for each day
  const dayCounts = new Array(7).fill(0);

  // Process each entry in the provided data
  data.forEach((item) => {
    const date = new Date(item.enrollmentTime);
    const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    dayCounts[dayOfWeek]++;
  });

  // Create the dataset for the chart
  const datasets = {
    label: "Enrollments",
    data: dayCounts,
  };

  // Return both labels and datasets
  return { labels, datasets };
}

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [deviceData, setDeviceData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [userData, setUserData] = useState([]);

  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const [deviceResponse, policyResponse, userResponse] = await Promise.all([
        fetch("api1/mdm/device").then((response) => response.json()),
        fetch("api3/mdm/policy").then((response) => response.json()),
        fetch("api4/users").then((response) => response.json()),
      ]);
      setUserData(userResponse);
      setDeviceData(deviceResponse.data);
      setPolicyData(policyResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate security posture data
  const secureDevicesCount = deviceData.filter(
    (device) => device.securityPosture.devicePosture === "SECURE"
  ).length;
  const nonSecureDevicesCount = deviceData.length - secureDevicesCount;

  const securityChartData = {
    labels: ["Secure Devices", "Non-Secure Devices"],
    datasets: [
      {
        data: [secureDevicesCount, nonSecureDevicesCount],
        backgroundColor: ["#4CAF50", "#FF5722"],
      },
    ],
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Devices"
                count={deviceData?.length}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Total Policy"
                count={policyData?.length}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="User"
                count={userData.length}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Device Enrollment Report"
                  chart={processData(deviceData)}
                  date="just updated"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="Device Count By Brand"
                  date="just updated"
                  chart={aggregateDevicesByBrand(deviceData)}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <Card style={{ padding: 10 }}>
                  <Doughnut data={securityChartData} options={{ aspectRatio: 1.18 }} />
                </Card>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
