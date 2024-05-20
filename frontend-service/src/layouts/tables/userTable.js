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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import {
  Modal,
  Box,
  Typography,
  Button,
  Popover,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogContent,
  DialogTitle,
  Dialog,
  CircularProgress,
} from "@mui/material";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import usersTableData from "layouts/tables/data/usersTableData";
import { useEffect, useState } from "react";
import {
  DeleteOutline,
  DeleteOutlined,
  EditOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";

import { extractDeviceName } from "./helper";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
async function fetchDeviceData() {
  try {
    const response = await fetch("/api1/mdm/device", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return `null` or handle the error appropriately
  }
}

// eslint-disable-next-line react/prop-types
function UserTable() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [loader, setLoader] = useState(true);

  const [barcodeValue, setBarcodeValue] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [devices, setDevices] = useState([]);

  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const handleAddDevice = async () => {
    console.log(selectedPolicy);
    if (!selectedPolicy) {
      return;
    }
    try {
      const response = await fetch("api2/mdm/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyName: selectedPolicy,
          oneTimeOnly: true,
          allowPersonalUsageFlag: true,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }

      setBarcodeValue("https://enterprise.google.com/android/enroll?et=" + data.data.value);
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Updated Sucessfully"
      content="Device List was successfully updated"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const handleActionClick = (event, device) => {
    setAnchorEl(event.currentTarget); // Set the current button as anchor
    setSelectedDevice(device); // Store the selected device data
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define your table data as before
  let columns = [];
  let rows = [];
  const handelDeviceClick = (event, device) => {
    handleActionClick(event, device);
  };
  // Add data and handle click

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("/api4/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Policies:", data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch policies");
        }
        setPolicies(data || []);
      } catch (error) {
        console.error("Error fetching policies:", error.message);
      }
      setLoader(false);
    };

    fetchPolicies();
  }, []);

  const navigate = useNavigate();
  const { columns: deviceColumns, rows: deviceRows } = usersTableData({
    policies,
    handelDeviceClick,
  });

  const handleDeletePolicy = async (policyName) => {
    try {
      const response = await fetch(`api3/mdm/policy/${policyName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "",
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }
      openSuccessSB();
      handleClose();
    } catch (error) {}
  };
  const handleViewClick = () => {
    navigate("/Policy-detail", { state: { device: selectedDevice } });
  };
  columns = deviceColumns;
  rows = deviceRows;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {renderSuccessSB}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",

            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <MDButton
            startIcon={<VisibilityOutlined />}
            onClick={() => handleViewClick()}
            sx={{ color: "black" }}
          >
            View
          </MDButton>
          <MDButton
            startIcon={<DeleteOutlined />}
            onClick={() => handleDeletePolicy(extractDeviceName(selectedDevice.name))}
            sx={{ color: "red" }}
          >
            Delete
          </MDButton>
        </Box>
      </Popover>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={3}>
                {loader && (
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress color="inherit" />
                  </Box>
                )}

                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserTable;
