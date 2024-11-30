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
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable"; // Ensure DataTable is imported

// Data
import CustomComplaintsData from "layouts/Complaints/data/index.js";
import ComplaintDetailsDialog from "layouts/tables/data/dialogBox/ComplaintDetailsDialog";


function Tables() {
  const { 
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
  } = CustomComplaintsData();

  // Define state variables and handlers for the dialog
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    // Handle form submission logic here
    setOpen(false);
  };

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
                  table={{ columns, rows,  }}
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

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ComplaintDetailsDialog
         open={openDialog} 
         handleClose={handleCloseDialog} 
         complaint={selectedComplaint}
         
       />
       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Tables;
