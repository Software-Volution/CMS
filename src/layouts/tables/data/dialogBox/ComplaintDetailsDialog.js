import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

function ComplaintDetailsDialog({ open, handleClose, complaint }) {
  if (!complaint) return null;

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 10,  // Rounded corners
          padding: '20px',   // Custom padding
        },
      }}
    >
      {/* Dialog Title Section */}
      <DialogTitle>
        <MDBox
          mx={2}
          mt={-1}
          py={3}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="bold" color="white">
            Complaint Details
          </MDTypography>
        </MDBox>
      </DialogTitle>

      {/* Dialog Content Section */}
      <DialogContent>
        <MDBox py={2}>
          <Card variant="outlined" sx={{ boxShadow: 3, p: 3, borderRadius: 3 }}>
            
            {/* Lodged By Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Lodged by
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.lodged_by}
            </MDTypography>

            {/* Type Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Type
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.type}
            </MDTypography>

            {/* Severity Level Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Severity Level
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.severity_level}
            </MDTypography>

            {/* Room No Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Room No
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.room_no}
            </MDTypography>

            {/* Description Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Description
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.description}
            </MDTypography>

            {/* Date Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Date
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
            {formatDate(complaint.date)}
            </MDTypography>

            {/* Status Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Status
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.status}
            </MDTypography>

            {/* Feedback Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Feedback
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {complaint.feedback}
            </MDTypography>
          </Card>
        </MDBox>
      </DialogContent>

      {/* Dialog Actions Section */}
      <DialogActions>
        <MDBox p={2} display="flex" justifyContent="center" width="100%">
          <Button
            onClick={handleClose}
            variant="contained"
            color="info"
            size="large"
            sx={{ fontWeight: 'bold', textTransform: 'none', width: '150px' }}
          >
            Close
          </Button>
        </MDBox>
      </DialogActions>
    </Dialog>
  );
}

export default ComplaintDetailsDialog;
