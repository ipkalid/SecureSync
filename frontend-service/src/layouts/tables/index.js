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
function Tables({ tableName }) {
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
        const response = await fetch("/api3/mdm/policy", {
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
        setPolicies(data.data || []);
      } catch (error) {
        console.error("Error fetching policies:", error.message);
      }
    };

    fetchPolicies();
  }, []);
  async function refreshDevice() {
    setLoader(true);
    const data = await fetchDeviceData();
    console.log(data.data);
    setLoader(false);

    if (data) {
      setDevices(data.data); // Store the fetched data in state
    }
  }
  useEffect(() => {
    async function loadDevice() {
      const data = await fetchDeviceData();
      console.log(data.data);
      setLoader(false);

      if (data) {
        setDevices(data.data); // Store the fetched data in state
      }
    }
    loadDevice();
  }, []);

  const navigate = useNavigate();
  const { columns: deviceColumns, rows: deviceRows } = authorsTableData({
    devices,
    handelDeviceClick,
  });

  const handleEditDevice = async (deviceId, policyName) => {
    try {
      const response = await fetch("api1/mdm/device/updateDevicePolicy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyName,
          deviceId,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to EDIT device");
      }
      setOpenModalEdit(false);
      await refreshDevice();
      openSuccessSB();
    } catch (error) {}
  };
  const handleDeleteDevice = async (name) => {
    handleClose();
    try {
      const response = await fetch(`api1/mdm/device/${name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }

      await refreshDevice();
      openSuccessSB();
    } catch (error) {}
  };
  const handleViewClick = () => {
    navigate("/device-detail", { state: { device: selectedDevice } });
  };
  columns = deviceColumns;
  rows = deviceRows;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDButton onClick={() => setOpenModal(true)}>Add Device</MDButton>
      {renderSuccessSB}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <MDBox pt={3}>
            <FormControl fullWidth>
              <MDTypography>Select Policy</MDTypography>
              <Select
                style={{ height: 40 }}
                labelId="policy-label"
                value={selectedPolicy}
                label="Policy"
                variant="outlined"
                fullWidth
                onChange={(e) => setSelectedPolicy(e.target.value)}
              >
                {policies.map((policy) => (
                  <MenuItem key={policy.id} value={policy.name}>
                    {extractDeviceName(policy.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {barcodeValue && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="barcode"
                  label="Device Registration URL"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={barcodeValue}
                  disabled
                />
                <QRCode value={barcodeValue} size={128} level="H" includeMargin />
                <Typography sx={{ color: "gray" }}>
                  This QR code will expire after 1 Hour
                </Typography>
              </Box>
            )}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleAddDevice}>Create Another</MDButton>
          <MDButton onClick={() => setOpenModal(false)}>Close</MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        aria-labelledby="device-details-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="device-details-dialog-title">Edit Device Policy</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" component="p" gutterBottom>
            Current Device Policy: {extractDeviceName(selectedDevice?.appliedPolicyName)}
          </Typography>

          <Box pt={2} pb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Select Policy to Apply
            </Typography>
            <Select
              style={{ height: "40px", marginBottom: "20px" }} // improved spacing and height for better interaction
              labelId="policy-label"
              value={selectedPolicy}
              label="Policy"
              fullWidth
              onChange={(e) =>
                handleEditDevice(
                  extractDeviceName(selectedDevice.name),
                  extractDeviceName(e.target.value)
                )
              }
            >
              {policies.map((policy) => (
                <MenuItem key={policy.id} value={policy.name}>
                  {policy.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Typography color="error" variant="caption" display="block" gutterBottom>
            Once you select a device policy, it will be applied immediately.
          </Typography>
        </DialogContent>
      </Dialog>
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
            startIcon={<EditOffOutlined />}
            onClick={() => setOpenModalEdit(true)}
            sx={{ color: "orange" }}
          >
            Edit Policy
          </MDButton>
          <MDButton
            startIcon={<DeleteOutlined />}
            onClick={() => handleDeleteDevice(extractDeviceName(selectedDevice.name))}
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

export default Tables;
