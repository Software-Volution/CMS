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

import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db, auth } from "layouts/authentication/firebase-config/firebase"; 

import React, {useState, useEffect} from 'react'




export default function ArtisanData() {
  const [rows, setRows] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [artisanWorkType, setArtisanWorkType] = useState(null);
  
  // Fetch the logged-in artisan's email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        console.log("User email: ", user.email);  // Debug: check if email is being set
      } else {
        console.error("No user logged in.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch the artisan's work type using their email
  useEffect(() => {
    const fetchArtisanWorkType = async () => {
      if (userEmail) {
        try {
          console.log("Fetching work type for email: ", userEmail);  // Debug: email used to query
          
          const artisansQuery = query(
            collection(db, "artisans"),
            where("email", "==", userEmail)
          );
          const artisanSnapshot = await getDocs(artisansQuery);

          if (!artisanSnapshot.empty) {
            const artisanDoc = artisanSnapshot.docs[0].data();
            console.log("Artisan data: ", artisanDoc);  // Debug: artisan document details
            setArtisanWorkType(artisanDoc.work);  // Assuming `work` holds the artisan's work type
          } else {
            console.error("No artisan found with the email: ", userEmail);
          }
        } catch (error) {
          console.error("Error fetching artisan work type: ", error);
        }
      }
    };

    fetchArtisanWorkType();
  }, [userEmail]);

  

  // Fetch complaints related to the specific artisan's work type
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!artisanWorkType) return;

      try {
        console.log("Fetching complaints for work type: ", artisanWorkType);  // Debug: work type used to query
        
        const complaintsQuery = query(
          collection(db, "complaints"),
          where("issueType", "==", artisanWorkType)  // Match complaints based on the artisan's work type
        );
        const querySnapshot = await getDocs(complaintsQuery);

        if (!querySnapshot.empty) {
          console.log("Complaints found: ", querySnapshot.size);  // Debug: number of complaints found
        } else {
          console.log("No complaints found for the work type: ", artisanWorkType);
        }

        const complaintsData = [];
        const avatars = [logoXD, logoAtlassian, logoSlack, logoSpotify, logoJira, logoInvesion];
        let avatarIndex = 0;

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

        setRows(complaintsData);
      } catch (error) {
        console.error("Error fetching complaints: ", error);
      }
    };

    if (artisanWorkType) {
      fetchComplaints();
    }
  }, [artisanWorkType]);

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