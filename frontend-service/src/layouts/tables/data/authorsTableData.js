/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { extractDeviceName } from "../helper";

export default function data({ devices, handelDeviceClick }) {
  return {
    columns: [
      { Header: "Name", accessor: "Name", width: "45%", align: "left" },
      { Header: "Brand", accessor: "Brand", align: "left" },
      { Header: "RAM", accessor: "RAM", align: "center" },
      { Header: "Storage", accessor: "Storage", align: "center" },
      { Header: "Policy", accessor: "Policy", align: "center" },

      { Header: "status", accessor: "status", align: "center" },

      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: devices?.map((device, index) => ({
      Name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {extractDeviceName(device.name)}
        </MDTypography>
      ),
      Brand: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {device.hardwareInfo.brand}
        </MDTypography>
      ),
      RAM: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {(device.memoryInfo.totalRam / 1024 / 1024 / 1024).toFixed(2)} GB
        </MDTypography>
      ),
      Storage: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {(device.memoryInfo.totalInternalStorage / 1024 / 1024 / 1024).toFixed(2)} GB
        </MDTypography>
      ),
      Policy: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {extractDeviceName(device.appliedPolicyName)}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent="active"
            color={device.state == "ACTIVE" ? "success" : "error"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={(e) => handelDeviceClick(e, device)}
        >
          Edit
        </MDTypography>
      ),
    })),
  };
}
