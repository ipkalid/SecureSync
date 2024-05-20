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

export default function data({ customConfig }) {
  console.log("custom", customConfig.data);
  if (customConfig?.data?.length == 0 || !customConfig.data) {
    return {
      columnsCustom: [
        { Header: "ID", accessor: "_id", width: "45%", align: "left" },
        { Header: "Configuration", accessor: "configuration_name", align: "left" },
        { Header: "Policy Name", accessor: "policyName", align: "left" },
      ],
      rowsCustom: [],
    };
  }
  return {
    columnsCustom: [
      { Header: "ID", accessor: "ID", width: "45%", align: "left" },
      { Header: "Configuration", accessor: "Configuration", align: "left" },
      { Header: "Name", accessor: "Name", align: "left" },
    ],

    rowsCustom: customConfig?.data?.map((policy, index) => ({
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
      Name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {policy?.policyName}
        </MDTypography>
      ),
    })),
  };
}
