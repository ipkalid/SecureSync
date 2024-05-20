/* eslint-disable react/prop-types */
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
  Stepper,
  Step,
  StepLabel,
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
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
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
function PolicyTable() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [customConfig, setCustomConfig] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [loader, setLoader] = useState(true);
  //manage tabs value
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const fetchCustomConfigPolicies = async () => {
    try {
      const response = await fetch("/api5/customConfigurations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("custom data :", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch policies");
      }
      setCustomConfig(data || []);
    } catch (error) {
      console.error("Error fetching policies:", error.message);
    }
  };

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
  async function refreshDevice() {
    setLoader(true);
    await fetchPolicies();
    setLoader(false);
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
    const fetchCustomConfigPolicies1 = async () => {
      try {
        const response = await fetch("/api5/customConfigurations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("custom data :", data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch policies");
        }
        setCustomConfig(data || []);
      } catch (error) {
        console.error("Error fetching policies:", error.message);
      }
    };
    fetchCustomConfigPolicies1();

    loadDevice();
  }, []);

  const navigate = useNavigate();
  const { columns: deviceColumns, rows: deviceRows } = projectsTableData({
    policies,
    handelDeviceClick,
  });

  let columnsCustom = [
    { Header: "ID", accessor: "ID", width: "45%", align: "left" },
    { Header: "Template Name", accessor: "Configuration", align: "left" },
    { Header: "Action", accessor: "Action", align: "left" },
  ];

  let rowsCustom = customConfig?.data?.map((policy, index) => {
    return {
      ID: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {policy?._id}
        </MDTypography>
      ),
      Configuration: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {policy?.configuration_name}
        </MDTypography>
      ),
      Action: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          <PolicyModal1 packages={policy} />
        </MDTypography>
      ),
    };
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
      await refreshDevice();
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
      {value === 1 && <PolicyModal />}
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
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Device Policies" />

                <Tab label="Custom Policy Management" />
              </Tabs>

              {value === 0 && (
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
              )}

              {value === 1 && (
                <MDBox pt={3}>
                  {loader && (
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <CircularProgress color="inherit" />
                    </Box>
                  )}

                  <DataTable
                    table={{ columns: columnsCustom, rows: rowsCustom ? rowsCustom : [] }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default PolicyTable;

const steps = ["Name Your Policy", "Choose Device Options", "Choose Apps"];

function PolicyModal() {
  const [open, setOpen] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({});
  const [installedApps, setInstalledApps] = useState({});
  const [policyName, setPolicyName] = useState("");
  const [savedPolicy, setSavedPolicy] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [deviceOptionsData, setDeviceOptionsData] = useState([]);
  const [appsCanBeInstalled, setAppsCanBeInstalled] = useState([]);

  const [checkedNames, setCheckedNames] = useState([]);
  const [checkedAppsNames, setCheckedAppsNames] = useState([]);
  console.log("checkedAppsNames:", checkedAppsNames);

  const handelOptionsChange = (event, checkObj) => {
    console.log("checkObj:", checkObj);
    const { checked } = event.target;
    if (checked) {
      // Add policy object to state
      setCheckedNames((prev) => [...prev, checkObj]);
    } else {
      // Remove policy object from state based on name
      setCheckedNames((prev) => prev.filter((p) => p.name !== checkObj.name));
    }
  };

  const handelAppsChange = (event, checkObj) => {
    console.log(checkObj);
    const { checked } = event.target;
    if (checked) {
      // Add policy object to state
      setCheckedAppsNames((prev) => [...prev, checkObj]);
    } else {
      // Remove policy object from state based on name
      setCheckedAppsNames((prev) => prev.filter((p) => p.name !== checkObj.name));
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("/api5/deviceSettingsOptions", {
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
        setDeviceOptionsData(data.data || []);
      } catch (error) {
        console.error("Error fetching policies:", error.message);
      }
    };

    const fetchPolicies1 = async () => {
      try {
        const response = await fetch("/api5/appsPackages/tasks", {
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
        setAppsCanBeInstalled(data.data[0] || []);
      } catch (error) {
        console.error("Error fetching policies:", error.message);
      }
    };
    fetchPolicies1();
    fetchPolicies();
  }, []);

  const filterDataApi = async (filter) => {
    try {
      const response = await fetch("/api5/appsPackages/" + filter, {
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
      setAppsCanBeInstalled(data.data[0] || []);
    } catch (error) {
      console.error("Error fetching policies:", error.message);
    }
  };
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep + 1 == 3) {
      handleSave();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    setSkipped(newSkipped);
  };
  console.log("Selected policies:", checkedNames);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleDeviceSetting = (option) => {
    setDeviceSettings((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleAddPolicy = async (policy) => {
    try {
      const response = await fetch("api5/saveCustomConfiguration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "",
        },
        body: JSON.stringify({
          ...policy,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleApp = (app) => {
    setInstalledApps((prev) => ({
      ...prev,
      [app]: !prev[app],
    }));
  };

  const handleSave = async () => {
    const applications = Object.keys(installedApps)
      .filter((app) => installedApps[app])
      .map((app) => ({
        packageName: appPackageMap[app],
        installType: "FORCE_INSTALLED",
      }));
    const policy = {
      name: policyName,
      policy: {
        applications,
        ...deviceSettings,
      },
    };
    const data = {
      apps: checkedAppsNames,
      deviceOptions: checkedNames,
      name: policyName,
      configuration_name: policyName,
    };
    console.log("devicccce", deviceSettings);
    setSavedPolicy(policy);
    await handleAddPolicy(data);
  };

  return (
    <Box>
      <MDButton onClick={handleClickOpen}>Create Policy Template</MDButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Set Up Custom Policy</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption"></Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

          {activeStep == 0 && (
            <TextField
              fullWidth
              label="Template Name"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              margin="normal"
            />
          )}
          {activeStep === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Device Settings
              </Typography>

              <FormGroup>
                {deviceOptionsData?.map((policy) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedNames.some((p) => p.name === policy.name)}
                        onChange={(e) => handelOptionsChange(e, policy)}
                        name={checkedNames.name}
                      />
                    }
                    label={policy.friendlyName}
                    key={policy._id}
                  />
                ))}
              </FormGroup>
            </>
          )}
          {activeStep === 2 && (
            <>
              {" "}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                Apps that can be installed
              </Typography>
              <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}
              >
                <MDButton onClick={() => filterDataApi("tasks")}>Tasks</MDButton>
                <MDButton onClick={() => filterDataApi("social")}>Social</MDButton>
                <MDButton onClick={() => filterDataApi("utilities")}>Utilities</MDButton>
              </div>
              <FormGroup>
                {appsCanBeInstalled?.apps?.map((app) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedAppsNames.some((p) => p.name === app.name)}
                        onChange={(e) => handelAppsChange(e, app)}
                        name={checkedAppsNames.name}
                      />
                    }
                    label={app.name}
                    key={app.name}
                  />
                ))}
              </FormGroup>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// eslint-disable-next-line react/prop-types
function PolicyModal1({ packages }) {
  const [open, setOpen] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({});
  const [installedApps, setInstalledApps] = useState({});
  const [policyName, setPolicyName] = useState("");
  const [savedPolicy, setSavedPolicy] = useState(null);
  console.log(packages);

  const appPackageMap =
    packages?.apps && typeof packages.apps === "object"
      ? packages?.apps.map((item) => {
          return { [item.name]: item.package };
        })
      : [];

  const deviceOption =
    packages?.deviceOptions && typeof packages.deviceOptions === "object"
      ? packages?.deviceOptions.map((item) => {
          return item.name;
        })
      : [];

  const appsOption =
    packages?.apps && typeof packages.apps === "object"
      ? packages?.apps.map((item) => {
          return item.name;
        })
      : [];

  console.log("hi", deviceOption);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleDeviceSetting = (option) => {
    setDeviceSettings((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleAddPolicy = async (policy) => {
    try {
      const response = await fetch("api3/mdm/policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "",
        },
        body: JSON.stringify({
          ...policy,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleApp = (app) => {
    setInstalledApps((prev) => ({
      ...prev,
      [app]: !prev[app],
    }));
  };

  const handleSave = async () => {
    const mapObj = appPackageMap.reduce((acc, current) => {
      // Merge each object in the array into the accumulator
      return { ...acc, ...current };
    }, {});
    const applications = Object.keys(installedApps)
      .filter((app) => installedApps[app])
      .map((app) => ({
        packageName: mapObj[app],
        installType: "FORCE_INSTALLED",
      }));
    const policy = {
      name: policyName,
      policy: {
        applications,
        ...deviceSettings,
      },
    };
    setSavedPolicy(policy);
    await handleAddPolicy(policy);
  };

  const findFriendlyName = (targetName) => {
    const dataArray =
      packages?.deviceOptions && typeof packages.deviceOptions === "object"
        ? packages?.deviceOptions
        : [];
    const item = dataArray.find((element) => element.name === targetName);
    return item ? item.friendlyName : null;
  };

  return (
    <Box>
      <Button onClick={handleClickOpen} sx={{ color: "white", backgroundColor: "black" }}>
        Choose Configuration Template
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Configure Policy Options</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Policy Name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            margin="normal"
          />
          <Typography variant="h6" gutterBottom>
            Device Settings
          </Typography>
          <FormGroup>
            {deviceOption?.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!deviceSettings[option]}
                    onChange={() => handleToggleDeviceSetting(option)}
                    name={option}
                  />
                }
                label={findFriendlyName(option)}
                key={option}
              />
            ))}
          </FormGroup>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Apps that can be installed
          </Typography>
          <FormGroup>
            {appsOption?.map((app) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!installedApps[app]}
                    onChange={() => handleToggleApp(app)}
                    name={app}
                  />
                }
                label={app}
                key={app}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
