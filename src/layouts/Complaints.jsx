import React, { useState } from 'react';
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';


import { Button, Snackbar, Alert } from '@mui/material';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "layouts/authentication/firebase-config/firebase";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable"; // Ensure DataTable is imported

// Data
import CustomComplaintsData from "layouts/student/data/index.js";

function Tables() {

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleViewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleFeedbackClick = (complaint) => {
    setSelectedComplaint(complaint)
    setOpenFeedbackDialog(true);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  const handleSubmitFeedback = async () => {
    if (selectedComplaint && selectedComplaint.id) {
      const complaintRef = doc(db, "complaints", selectedComplaint.id);
      await updateDoc(complaintRef, { feedback: description });
  
      // Update the feedback locally and reflect in the dialog
      setSelectedComplaint((prev) => ({ ...prev, feedback: description }));
  
      // Close the feedback dialog and show success message
      setOpenFeedbackDialog(false);
      setSnackbarOpen(true);
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  const { columns, rows } = CustomComplaintsData({ onViewClick: handleViewClick, onFeedbackClick: handleFeedbackClick,});

  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                Complaints
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>


      {/* Dialog for showing complaint details */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDialog}>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <>
              <MDTypography variant="subtitle1">
                <strong>Type:</strong> {selectedComplaint.issueType}
              </MDTypography>
              <MDTypography variant="subtitle1">
                <strong>Description:</strong> {selectedComplaint.description}
              </MDTypography>
              <MDTypography variant="subtitle1">
                <strong>Date:</strong> {selectedComplaint.date.toDate().toLocaleDateString()}
              </MDTypography>
              <MDTypography variant="subtitle1">
                <strong>Status:</strong> {selectedComplaint.status}
              </MDTypography>
              <MDTypography variant="subtitle1">
                <strong>Severity:</strong> {selectedComplaint.severity}
              </MDTypography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Feedback successfully submitted!
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Tables;



