// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import { collection, getDocs } from "firebase/firestore"; 
import { db } from "layouts/authentication/firebase-config/firebase"; 

import React, {useState, useEffect} from 'react'




export default function Data() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const complaintsData = [];

      // Define avatars to maintain structure
      const avatars = [
        logoXD,
        logoAtlassian,
        logoSlack,
        logoSpotify,
        logoJira,
        logoInvesion,
      ];

      let avatarIndex = 0;

      // Loop through each complaint document
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        

        complaintsData.push({
          complainant: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              
              <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {data.name}
              </MDTypography>
            </MDBox>
          ),
          roomnumber: (
            <MDBox display="flex" py={1}>
              {data.roomNo}
            </MDBox>
          ),
          priority: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {data.severity}
            </MDTypography>
          ),
          priority_level: (
            <MDBox width="8rem" textAlign="left">
              <MDProgress 
                value={getPriorityLevel(data.severity)} 
                color={getProgressBarColor(data.severity)} 
                variant="gradient" 
                label={false} 
              />
            </MDBox>
          ),
        });
      });

      // Set the fetched complaints into the rows state
      setRows(complaintsData);
    };

    fetchComplaints();
  }, []);

  // Function to calculate the progress bar value based on severity
  const getPriorityLevel = (severity) => {
    switch (severity) {
      case "high":
        return 100; // 100% progress for high severity
      case "medium":
        return 60;  // 60% progress for medium severity
      case "low":
        return 30;  // 30% progress for low severity
      case "High":
        return 100; // 100% progress for high severity
      case "Medium":
        return 60;  // 60% progress for medium severity
      case "Low":
        return 30;  // 30% progress for low severity  
      default:
        return 0;   // Default to 0% for undefined or missing severity
    }
  };

  // Function to return color based on severity
  const getProgressBarColor = (severity) => {
    switch (severity) {
      case "high":
        return "error"; // Red color for high severity
      case "medium":
        return "warning"; // Yellow color for medium severity
      case "low":
        return "info"; // Blue color for low severity
      case "High":
        return "error"; // Red color for high severity
      case "Medium":
        return "warning"; // Yellow color for medium severity
      case "Low":
        return "info"; // Blue color for low severity  
      default:
        return "dark"; // Default color for undefined or missing severity
    }
  };

  const columns = [
    { Header: "complainant", accessor: "complainant", width: "45%", align: "left" },
    { Header: "roomnumber", accessor: "roomnumber", width: "10%", align: "left" },
    { Header: "priority", accessor: "priority", align: "center" },
    { Header: "priority_level", accessor: "priority_level", align: "center" },
  ];

  return {
    columns,
    rows,
  };
}