import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from 'layouts/authentication/firebase-config/firebase';




function Tables() {
  const [columns] = useState([
    { Header: 'Description', accessor: 'description' },
    { Header: 'Action Status', accessor: 'actions' },
    { Header: 'R.Status', accessor: 'rStatus' },
  ]);



  const [rows, setRows] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [artisanWork, setArtisanWork] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanWork = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDocs(query(collection(db, 'artisans'), where('email', '==', user.email)));
        const userData = userDoc.docs[0]?.data();
        if (userData) {
          setArtisanWork(userData.work); 
        }
      }
    };

    fetchArtisanWork();
  }, []);

   
  useEffect(() => {
    const fetchAcceptedComplaints = async () => {
      if (!artisanWork) return;
  
      const q = query(
        collection(db, 'complaints'),
        where('status', '==', 'Accepted'),
        where('issueType', '==', artisanWork)
      );
  
      const querySnapshot = await getDocs(q);
      const acceptedComplaints = querySnapshot.docs.map((doc) => {
        const complaint = doc.data();
        return {
          id: doc.id,
          description: complaint.description,
          status: 'Pending Artisan Action',
          severity_level: complaint.severity,
          room_no: complaint.roomNo,
          date: complaint.date.toDate().toLocaleDateString(),
          actions: (
            <MDBox display="flex" gap={2}>
              <IconButton color="info" onClick={() => handleViewClick(complaint)}>
                <VisibilityIcon />
              </IconButton>
            </MDBox>
          ),
          rStatus: (
            <MDBox display="flex" gap={2}>
              <IconButton color="success" onClick={() => handleAcceptComplaint(doc.id)}>
                <CheckCircle />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeclineComplaint(doc.id)}>
                <CancelIcon />
              </IconButton>
            </MDBox>
          ),
        };
      });
  
      setRows(acceptedComplaints);
      setLoading(false);
    };
  
    fetchAcceptedComplaints();
  }, [artisanWork]);


  const handleViewClick = (complaint) => {
    setDialogContent(complaint);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAcceptComplaint = async (complaintId) => {
    try {
      // Update the complaint status in Firestore
      await updateDoc(doc(db, 'complaints', complaintId), { status: 'Accepted by Artisan' });
      
      
      setRows((prevRows) => prevRows.filter((row) => row.id !== complaintId)); 
      
      setSnackbarMessage('Complaint accepted and removed.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error('Error accepting complaint:', error);
      setSnackbarMessage('Failed to accept complaint.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Show error message
    }
  };
  

  const handleDeclineComplaint = async (complaintId) => {
    try {
      await updateDoc(doc(db, 'complaints', complaintId), { status: 'Declined by Artisan' });
      setRows(rows.filter(row => row.id !== complaintId));
      setSnackbarMessage('Complaint declined.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true); // Show information message
    } catch (error) {
      console.error('Error declining complaint:', error);
      setSnackbarMessage('Failed to decline complaint.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Show error message
    }
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
                  Requests
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              {loading ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress /> 
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog for showing request details */}
      <Dialog
  open={dialogOpen}
  onClose={handleDialogClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    style: {
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    },
  }}
>
  <DialogTitle>
    <MDTypography variant="h5" fontWeight="bold" color="textPrimary">
      Complaint Details
    </MDTypography>
  </DialogTitle>
  <DialogContent dividers>
    <DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Name:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.name || 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Room Number:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.roomNo || 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Block:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.block || 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Issue Type:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.issueType || 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Date:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.date ? new Date(dialogContent.date.seconds * 1000).toLocaleDateString() : 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Severity:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.severity || 'N/A'}
          </MDTypography>
        </Grid>
        <Grid item xs={12}>
          <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
            <strong>Description:</strong>
          </MDTypography>
          <MDTypography variant="body1" color="textPrimary">
            {dialogContent.description || 'N/A'}
          </MDTypography>
        </Grid>
      </Grid>
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={handleDialogClose}
      variant="contained"
      color="primary"
      style={{ textTransform: 'none' }}
    >
      Close
    </Button>
  </DialogActions>
  </Dialog>
  
  {/* Snackbar for success or error messages */}
  <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
  </DashboardLayout>
  );
}

export default Tables;
