import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';






// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar"; 

import { collection, getDocs, deleteDoc, doc, addDoc, where, query } from 'firebase/firestore';
import { db } from "layouts/authentication/firebase-config/firebase";
import { Padding } from "@mui/icons-material";

function StudentNotifications() {
 

  
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const openSnack = () => setSnackOpen(true);
  const closeSnack = () => setSnackOpen(false);
  const [snackSeverity, setSnackSeverity] = useState("");

  // const alertContent = (name) => (
  //   <MDTypography variant="body2" color="white">
  //     A simple {name} alert with{" "}
  //     <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
  //       an example link
  //     </MDTypography>
  //     . Give it a click if you like.
  //   </MDTypography>
  // );

  // const renderSuccessSB = (
  //   <MDSnackbar
  //     color="success"
  //     icon="check"
  //     title="Material Dashboard"
  //     content="Hello, world! This is a notification message"
  //     dateTime="11 mins ago"
  //     open={successSB}
  //     onClose={closeSuccessSB}
  //     close={closeSuccessSB}
  //     bgWhite
  //   />
  // );

  // const renderInfoSB = (
  //   <MDSnackbar
  //     icon="notifications"
  //     title="Material Dashboard"
  //     content="Hello, world! This is a notification message"
  //     dateTime="11 mins ago"
  //     open={infoSB}
  //     onClose={closeInfoSB}
  //     close={closeInfoSB}
  //   />
  // );

  // const renderWarningSB = (
  //   <MDSnackbar
  //     color="warning"
  //     icon="star"
  //     title="Material Dashboard"
  //     content="Hello, world! This is a notification message"
  //     dateTime="11 mins ago"
  //     open={warningSB}
  //     onClose={closeWarningSB}
  //     close={closeWarningSB}
  //     bgWhite
  //   />
  // );

  // const renderErrorSB = (
  //   <MDSnackbar
  //     color="error"
  //     icon="warning"
  //     title="Material Dashboard"
  //     content="Hello, world! This is a notification message"
  //     dateTime="11 mins ago"
  //     open={errorSB}
  //     onClose={closeErrorSB}
  //     close={closeErrorSB}
  //     bgWhite
  //   />
  // );

  const [notifications, setNotifications] = useState([])
 

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Fetch new complaints
        const q = query(collection(db, "complaints"), where("status", "==", "Open"));
        const complaintsSnapshot = await getDocs(q);
        const complaintsData = [];
        complaintsSnapshot.forEach(async (complaintDoc) => {
          const data = complaintDoc.data();
          complaintsData.push({ ...data, id: complaintDoc.id });
  
          // Check if the complaint has already been added to notifications
          const notificationQuery = query(collection(db, "notifications"), where("message", "==", `New complaint from ${data.name} about ${data.issueType}`));
          const notificationSnapshot = await getDocs(notificationQuery);
  
          // If no notification exists, add it to the notifications collection
          if (notificationSnapshot.empty) {
            await addDoc(collection(db, "notifications"), {
              message: `New complaint from ${data.name} about ${data.issueType}`,
              severity: data.severity,
              roomNo: data.roomNo,
              residence: data.residence,
              issueType: data.issueType,
              description: data.description,
              date: new Date(),
            });
          }
        });
  
        // Fetch all notifications
        const notificationsSnapshot = await getDocs(collection(db, "notifications"));
        const notificationsData = [];
        notificationsSnapshot.forEach((doc) => {
          notificationsData.push({ ...doc.data(), id: doc.id });
        });
  
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching complaints or notifications:", error);
      }
    };
  
    fetchComplaints();
  }, []);
  


  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationsSnapshot = await getDocs(collection(db, "notifications"));
      const notificationsData = [];
      notificationsSnapshot.forEach((doc) => {
        notificationsData.push({ ...doc.data(), id: doc.id }); 
      });
      setNotifications(notificationsData);
    };
    fetchNotifications();
  }, []);

  

  

  const handleDeleteNotification = async (id, message) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications(notifications.filter((notification) => notification.id !== id));

      // Set the snack message and show it
      setSnackMessage(`Notification "${message}" deleted successfully!`);
      openSnack();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getCustomSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return "#28a745";  // Custom green for success
      case 'warning':
        return "#ffc107";  // Custom yellow for warning
      case 'error':
        return "#dc3545";  // Custom red for error
      case 'info':
        return "#17a2b8";  // Custom blue for info
      default:
        return "#6c757d";  // Fallback grey for undefined severity
    }
  };

  const renderNotification = (notification, index) => {
    const notificationSeverity = notification.severity?.toLowerCase();
    const severityColor = getCustomSeverityColor(notificationSeverity);
  
    // Ensure the date is properly formatted
    const notificationDate = notification.date instanceof Date
      ? notification.date
      : notification.date?.toDate?.() || new Date(notification.date);
  
    return (
      <div key={index}>
        <MuiAlert
          severity={notificationSeverity}
          style={{
            backgroundColor: severityColor,
            color: "white",
            marginBottom: expandedIndex === index ? "0px" : "16px", 
            width: "100%", 
          }}
        >
          <Grid container justifyContent="space-between" alignItems="center" >
            <Grid item xs={10}>
              <MDTypography variant="body2" color="white">
                {notification.message} - <strong>{notification.severity?.toUpperCase() || "UNKNOWN"}</strong>
              </MDTypography>
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <IconButton style={{color: '#fff'}} onClick={() => toggleDetails(index)} sx={{ color: "white" }}>
                {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton style={{color: '#fff'}} onClick={() => handleDeleteNotification(notification.id, notification.message)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </MuiAlert>
  
        {expandedIndex === index && (
          <MDBox
            mt={0} 
            mb={2} 
            p={2}
            sx={{
              backgroundColor: severityColor,  
              color: "white",          
              borderRadius: "4px",
              width: "100%", 
            }}
          >
            <MDTypography variant="body2" color="white">
              <strong>Room No:</strong> {notification.roomNo || 'N/A'}
            </MDTypography>
            <MDTypography variant="body2" color="white">
              <strong>Residence:</strong> {notification.residence|| 'N/A'}
            </MDTypography>
            <MDTypography variant="body2" color="white">
              <strong>Issue Type:</strong> {notification.issueType || 'N/A'}
            </MDTypography>
            <MDTypography variant="body2" color="white">
              <strong>Description:</strong> {notification.description || 'N/A'}
            </MDTypography>
            <MDTypography variant="body2" color="white">
              <strong>Date:</strong> {notificationDate ? notificationDate.toLocaleString() : 'N/A'}
            </MDTypography>
          </MDBox>
        )}
      </div>
    );
  };
  
  

  
  
  
  



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Notifications</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {notifications.length === 0 ? (
                  <MDTypography variant="body1" color="text">
                    No new notifications
                  </MDTypography>
                ) : (
                  notifications.map((notification, index) => 
                    renderNotification(notification, index)
                  )
                )}
              </MDBox>
              {/* <MDBox p={2}>
                 <Grid container spacing={3}>
                   <Grid item xs={12} sm={6} lg={3}>
                     <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                       success notification
                     </MDButton>
                     {renderSuccessSB}
                   </Grid>
                   <Grid item xs={12} sm={6} lg={3}>
                     <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                       info notification
                     </MDButton>
                     {renderInfoSB}
                   </Grid>
                   <Grid item xs={12} sm={6} lg={3}>
                     <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                       warning notification
                     </MDButton>
                     {renderWarningSB}
                   </Grid>
                   <Grid item xs={12} sm={6} lg={3}>
                     <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                       error notification
                     </MDButton>
                     {renderErrorSB}
                   </Grid>
                 </Grid>
               </MDBox> */}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDSnackbar
        color="info"
        icon="info"
        title="Notification"
        content={snackMessage}
        dateTime="now"
        open={snackOpen}
        onClose={closeSnack}
        close={closeSnack}
      />
    </DashboardLayout>
  );
}


 

export default StudentNotifications;