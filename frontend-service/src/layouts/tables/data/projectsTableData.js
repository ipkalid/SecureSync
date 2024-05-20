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

export default function data({ policies, handelDeviceClick }) {
  return {
    columns: [
      { Header: "Name", accessor: "Name", width: "45%", align: "left" },
      { Header: "Version", accessor: "Version", align: "left" },

      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: policies?.map((policy, index) => ({
      Name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {extractDeviceName(policy.name)}
        </MDTypography>
      ),
      Version: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {policy.version}
        </MDTypography>
      ),

      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={(e) => handelDeviceClick(e, policy)}
        >
          Edit
        </MDTypography>
      ),
    })),
  };
}
