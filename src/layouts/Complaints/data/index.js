import React, {useState, useEffect} from "react";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";


import { db } from "layouts/authentication/firebase-config/firebase";
import {collection,  getDocs, doc, updateDoc, addDoc } from 'firebase/firestore'

function CustomTableData() {
  
  const [rows, setRows] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleViewClick = (complaint) => {
    console.log("Selected complaint: ", complaint);
    setSelectedComplaint(complaint);  // Set the selected complaint
    setOpenDialog(true);  // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAccept = async (complaintId) => {
    try {
      // Update complaint status
      await updateDoc(doc(db, "complaints", complaintId), { status: "Accepted", adminAcceptedAt: new Date() });
  
      // Add a notification for accepted complaint
      await addDoc(collection(db, "notifications"), {
        message: `Complaint ID: ${complaintId} has been accepted.`,
        severity: "success",
        date: new Date(),
        complaintId: complaintId,
        status: "open",
    
      });
  
      updateRows(complaintId, "Accepted");
      setSnackbarMessage('Complaint Accepted');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error accepting complaint:", error);
    }
  };
  
  const handleDecline = async (complaintId) => {
    try {
      // Update complaint status
      await updateDoc(doc(db, "complaints", complaintId), { status: "Declined", adminDeclinedAt: new Date() });
  
      // Add a notification for declined complaint
      await addDoc(collection(db, "notifications"), {
        message: `Complaint ID: ${complaintId} has been declined.`,
        severity: "warning",
        date: new Date(),
        complaintId: complaintId,
        status: "open"
      });
  
      updateRows(complaintId, "Declined");
      setSnackbarMessage('Complaint Declined');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error declining complaint:", error);
    }
  };
  

  const updateRows = (complaintId, status) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === complaintId) {
        return {
          ...row,
          status: status,
          condition: (
            <MDTypography variant="caption" color={status === "Accepted" ? "success" : "error"}>
              {status}
            </MDTypography>
          ),
        };
      }
      return row;
    }));
  };

  // Utility function to safely format dates
const formatDate = (date) => {
  if (date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString();
  } else if (date instanceof Date) {
    return date.toLocaleDateString();
  } else if (typeof date === 'string') {
    return date;
  }
  return 'N/A';
};
 

useEffect(() => {
  const fetchAllComplaints = async () => {
    const querySnapshot = await getDocs(collection(db, "complaints"));
    const complaintsData = querySnapshot.docs.map(doc => {
      const complaint = doc.data();

      return {
        id: doc.id,
        lodged_by: complaint.name || "N/A",
        type: complaint.issueType || "N/A",
        severity_level: complaint.severity || "N/A",
        room_no: complaint.roomNo || "N/A",
        description: complaint.description || "N/A",
        date: formatDate(complaint.date),
        status: complaint.status || "N/A",
        residence: complaint.residence || "N/A",
        feedback: complaint.feedback || "N/A",
        action: (
          <MDTypography variant="contained" color="primary" onClick={() => handleViewClick(complaint)}>
            View
          </MDTypography>
        ),
        condition: complaint.status === "Accepted" || complaint.status === "Declined" ? (
          <MDTypography variant="caption" color={complaint.status === "Accepted" ? "success" : "error"}>
            {complaint.status}
          </MDTypography>
        ) : (
          <MDBox display="flex" gap={2}>
            <IconButton color="success" onClick={() => handleAccept(doc.id)}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDecline(doc.id)}>
              <CancelIcon />
            </IconButton>
          </MDBox>
        ),
      };
    });

    // Sort the complaints: those without "Accepted" or "Declined" status come first
    const sortedComplaints = complaintsData.sort((a, b) => {
      const statusOrder = { "Accepted": 1, "Declined": 1 };
      return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    });

    setRows(sortedComplaints);
  };

  fetchAllComplaints();
}, []);


  const columns = [
    { Header: "lodged by", accessor: "lodged_by" },
    { Header: "type", accessor: "type" },
    { Header: "sev. level", accessor: "severity_level" },
    { Header: "room no", accessor: "room_no" },
    { Header: "description", accessor: "description" },
    { Header: "date", accessor: "date" },
    { Header: "status", accessor: "status" },
    { Header: "action", accessor: "action" },
    { Header: "condition", accessor: "condition" },
  ];
  


  return { 
    columns, 
    rows, 
    openDialog, 
    selectedComplaint, 
    handleCloseDialog,
    setOpenDialog,
    setSelectedComplaint,
    snackbarOpen, 
    snackbarMessage, 
    snackbarSeverity,  
    handleSnackbarClose
  };
}

export default CustomTableData;


