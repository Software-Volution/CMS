// dialogBox/studentDetailsDialog.jsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

function StudentDetailsDialog({ open, onClose, student }) {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            Student Details
          </MDTypography>
        </MDBox>
      </DialogTitle>
      
      {/* Dialog Content Section */}
      <DialogContent>
        <MDBox py={2}>
          <Card variant="outlined">
            <MDBox p={3}>
              {/* Name Section */}
              <MDTypography variant="subtitle1" fontWeight="medium" color="text">
                Name
              </MDTypography>
              <MDTypography variant="body1" color="text" mb={2}>
                {student.name}
              </MDTypography>

              {/* RoomNo Section */}
              <MDTypography variant="subtitle1" fontWeight="medium" color="text">
                Room No.
              </MDTypography>
              <MDTypography variant="body1" color="text" mb={2}>
                {student.roomNo}
              </MDTypography>

              {/* Date Section */}
              <MDTypography variant="subtitle1" fontWeight="medium" color="text">
                Student ID
              </MDTypography>
              <MDTypography variant="body1" color="text" mb={2}>
                {student.id}
              </MDTypography>
            </MDBox>
          </Card>
        </MDBox>
      </DialogContent>

      {/* Dialog Actions Section */}
      <DialogActions>
        <MDBox p={2} display="flex" justifyContent="center" width="100%">
          <Button onClick={onClose} variant="contained" color="info" size="large" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
            Close
          </Button>
        </MDBox>
      </DialogActions>
    </Dialog>
  );
}

export default StudentDetailsDialog;
