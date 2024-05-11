import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import {
  Devices as DevicesIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  MoreHoriz as MoreHorizIcon,
  RefreshOutlined,
} from "@mui/icons-material";
import QRCode from "qrcode.react";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Alert } from "./LoginForm";
import { extractDeviceName } from "../helpers/index";

const renderContent = (item) => {
  if (Array.isArray(item)) {
    return item?.map((subItem, index) => (
      <div key={index}>{renderContent(subItem)}</div>
    ));
  } else if (typeof item === "object") {
    return <NestedListItem data={item} />;
  } else {
    return String(item);
  }
};

// Component to render nested list items for objects
const NestedListItem = ({ data }) => (
  <List dense>
    {Object.entries(data)?.map(([key, value], index) => (
      <ListItem key={index}>
        <ListItemText primary={key} secondary={renderContent(value)} />
      </ListItem>
    ))}
  </List>
);

function DeviceDetailsModal({ device, open, onClose }) {
  return (
    <Box sx={{ maxWidth: 600, margin: "auto" }}>
      <NestedListItem data={device} />
    </Box>
  );
}

function DeviceManagement({ token }) {
  const [devices, setDevices] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPolicyEdit, setPolicyEdit] = useState(false);

  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDeviceCount, setNewDeviceCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  const handleOpenModal = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api1/mdm/device", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch devices");
      }

      setDevices(data.data);
      console.log("Devices:", data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  console.log("barcodeValue:", barcodeValue);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api1/mdm/device", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": token,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch devices");
        }

        setDevices(data.data);
        console.log("Devices:", data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDevices();
  }, [token]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("/api3/mdm/policy", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": token,
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
  }, [token]);

  const handleDeleteDevice = async (name) => {
    try {
      const response = await fetch(`api1/mdm/device/${name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": token,
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }

      await fetchDevices();
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditDevice = async (deviceId, policyName) => {
    setPolicyEdit(true);
    try {
      const response = await fetch("api1/mdm/device/updateDevicePolicy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": token,
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
      setPolicyEdit(false);

      setIsModalOpen(false);
      await fetchDevices();
    } catch (error) {
      setPolicyEdit(false);

      setError(error.message);
    }
  };
  const handleAddDevice = async () => {
    if (!selectedPolicy) {
      setError("Please select a policy before adding a device.");
      return;
    }
    try {
      const response = await fetch("api2/mdm/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": token,
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

      setBarcodeValue(
        "https://enterprise.google.com/android/enroll?et=" + data.data.value
      );
      setOpenModal(true);
      setNewDeviceCount(newDeviceCount + 1);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 10, marginTop: 10 }}>
      <Button variant="contained" onClick={() => setOpenModal(true)}>
        Add Device
      </Button>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="policy-label">Policy</InputLabel>
            <Select
              labelId="policy-label"
              value={selectedPolicy}
              label="Policy"
              onChange={(e) => setSelectedPolicy(e.target.value)}
            >
              {policies?.map((policy) => (
                <MenuItem key={policy.id} value={policy.name}>
                  {policy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          {barcodeValue && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
              }}
            >
              <QRCode value={barcodeValue} size={128} level="H" includeMargin />
              <Typography sx={{ color: "gray" }}>
                This QR code will expire after 1 Hour
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDevice} color="primary">
            Save
          </Button>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Device (Brand)</TableCell>
              <TableCell>RAM</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Policy Applied</TableCell>
              <TableCell>More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices?.map((device, index) => (
              <TableRow key={index}>
                <TableCell>{extractDeviceName(device.name)}</TableCell>
                <TableCell> {device.hardwareInfo.brand}</TableCell>
                <TableCell>
                  {Math.round(device.memoryInfo.totalRam / 1e9)} GB
                </TableCell>
                <TableCell>
                  {Math.round(device.memoryInfo.totalInternalStorage / 1e9)} GB
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.state}
                    color={device.state === "ACTIVE" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  {extractDeviceName(device.appliedPolicyName)}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(device)}>
                    <MoreHorizIcon />
                  </Button>
                  <Dialog
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="device-details-dialog-title"
                    fullWidth
                    maxWidth="md"
                  >
                    <DialogTitle id="device-details-dialog-title">
                      Device Details{" "}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleDeleteDevice(extractDeviceName(device.name))
                        }
                      >
                        <DeleteIcon /> Delete Device
                      </Button>
                      <div style={{ width: "100%", marginTop: 20 }}>
                        <FormControl fullWidth>
                          <InputLabel id="policy-label">
                            Choose A New Policy
                          </InputLabel>

                          <Select
                            labelId="policy-label"
                            value={
                              selectedPolicy
                                ? selectedPolicy
                                : extractDeviceName(device.appliedPolicyName)
                            }
                            label="Policy"
                            onChange={(e) =>
                              handleEditDevice(
                                extractDeviceName(device.name),
                                extractDeviceName(e.target.value)
                              )
                            }
                          >
                            {policies?.map((policy) => (
                              <MenuItem key={policy.id} value={policy.name}>
                                {policy.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {isPolicyEdit && <p>Updating Policy is in progress</p>}
                      </div>
                    </DialogTitle>
                    <DialogContent>
                      <DeviceDetailsModal device={selectedDevice} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DeviceManagement;
