import React, { useState, useEffect } from 'react';
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Firebase imports
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "layouts/authentication/firebase-config/firebase";

function OrdersOverview() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchLatestComplaints = async () => {
      try {
        // Query to get the latest 6 or 7 complaints
        const complaintsQuery = query(
          collection(db, "complaints"),
          orderBy("date", "desc"),
          limit(7) // Fetch the latest 7 complaints
        );

        const complaintsSnapshot = await getDocs(complaintsQuery);
        const latestComplaints = complaintsSnapshot.docs.map((doc) => {
          const complaint = doc.data();
          return {
            name: complaint.name,
            action: `${complaint.status}`, // e.g., Accepted, Declined, Open
            date: complaint.date.toDate().toLocaleDateString(),
            icon: complaint.status === "Accepted" ? "check_circle" : (complaint.status === "Declined" ? "cancel" : "report_problem"),
            iconColor: complaint.status === "Accepted" ? "success" : (complaint.status === "Declined" ? "error" : "primary"),
          };
        });

        // Set the dynamic notifications
        setNotifications(latestComplaints);
      } catch (error) {
        console.error("Error fetching latest complaints:", error);
      }
    };

    fetchLatestComplaints();
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Notification
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {notifications.map((notification, index) => (
          <MDBox
            key={index}
            display="flex"
            alignItems="center"
            mb={2}
            p={2}
            borderRadius="lg"
            bgcolor={notification.iconColor === "primary" ? "rgba(0, 123, 255, 0.1)" : "transparent"}
            sx={{ backgroundColor: notification.iconColor === "primary" ? "rgba(0, 123, 255, 0.1)" : "transparent" }}
          >
            <MDBox
              width="3rem"
              height="3rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              sx={{ backgroundColor: notification.iconColor, color: "white", marginRight: "1rem" }}
            >
              <Icon>{notification.icon}</Icon>
            </MDBox>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium" color="text">
                {notification.name}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {notification.action} on <strong>{notification.date}</strong>.
              </MDTypography>
            </MDBox>
          </MDBox>
        ))}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
