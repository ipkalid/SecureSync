import React, { useEffect, useState } from "react";
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
  Box,
  Chip,
} from "@mui/material";
import { RefreshOutlined, InfoOutlined } from "@mui/icons-material";
import { PolicyManagementData } from "../helpers/mockData";
import { extractDeviceName } from "../helpers/index";
import PolicyModal from "../components/PolicyManagementModal";
import DeleteIcon from "@mui/icons-material/Delete";

function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(false);


  const [open, setOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleRefresh = () => {
    // This function should handle the refresh logic, possibly fetching updated data
    console.log("Data refreshed");
  };

  const fetchPolices = async () => {
    try {
      const response = await fetch("/api3/mdm/policy", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch devices");
      }
      setLoading(false);
      setFirstLoading(false)

      setPolicies(data.data);
      console.log("Devices:", data.data);
    } catch (error) {
      setLoading(false);
      setFirstLoading(false)

    }
  };
  const handleDeletePolicy = async (policyName) => {
    try {
      setLoading(true);
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

      await fetchPolices();
      setOpen(false);
      setLoading(false)
      setFirstLoading(false)

    } catch (error) {
      setLoading(false)
      setFirstLoading(false)
      setError(true)

    }
  };

  useEffect(() => {
    fetchPolices();
  }, []);

  if (firstLoading) return <p>Loading ...</p>;

  const handleOpen = (policy) => {
    setSelectedPolicy(policy);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderPolicyDetails = (policy) => {
    if (!policy) return null;

    const renderValue = (value) => {
      if (Array.isArray(value)) {
        // For arrays, return a JSON string
        return JSON.stringify(value, null, 2);
      } else if (typeof value === 'object' && value !== null) {
        // For objects, recursively call renderValue on each key
        return JSON.stringify(value, null, 2); // Or handle rendering objects differently
      } else {
        // For primitives (string, number), return them as is
        return value;
      }
    };
  
    const details = Object.keys(policy).map((key) => (
      <Typography key={key}>
        {`${key}: ${renderValue(policy[key])}`}
      </Typography>
    ));
  
    return <Box sx={{ p: 2 }}>{details}</Box>;
  };

  return (
    <div
      style={{
        padding: 10,
        marginTop: 10,
      }}
    >
      <Box
        sx={{
          margin: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshOutlined />}
        >
          Refresh Data
        </Button>
        <PolicyModal />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Policy Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {extractDeviceName(policy.name)}
                </TableCell>
                <TableCell>{policy.version}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpen(policy)}
                    startIcon={<InfoOutlined />}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Policy Details{" "}
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              handleDeletePolicy(extractDeviceName(selectedPolicy.name))
            }
          >
            <DeleteIcon /> Delete Device
          </Button>
        </DialogTitle>
        <DialogContent>
        {error && <p style={{color:'red'}}>Policy is Linked to active device remove it first then try again</p>}
          {loading ? <p>Deleting Policy in IN PROGRESS ...</p>:
          selectedPolicy && renderPolicyDetails(selectedPolicy)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PolicyManagement;
