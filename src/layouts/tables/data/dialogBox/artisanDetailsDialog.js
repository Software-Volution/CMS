// dialogBox/artisanDetailsDialog.jsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

function ArtisanDetailsDialog({ open, onClose, artisan }) {

  

  if (!artisan) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
        style: {
          borderRadius: 10,
          padding: '20px',
        },
      }}>
      
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
            Artisan Details
          </MDTypography>
        </MDBox>
      </DialogTitle>
      
      {/* Dialog Content Section */}
      <DialogContent>
        <MDBox py={2}>
          <Card variant="outlined" sx={{ boxShadow: 3, p: 3, borderRadius: 3 }}>
            {/* Name Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Name
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {artisan.name}
            </MDTypography>

            {/* Email Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Email
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {artisan.email}
            </MDTypography>

            {/* Function/Work Section */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Function
            </MDTypography>
            <MDTypography variant="body1" color="textPrimary" mb={2}>
              {artisan.work}
            </MDTypography>

            {/* Uploaded Reports */}
            <MDTypography variant="subtitle1" fontWeight="medium" color="textSecondary">
              Uploaded Reports
            </MDTypography>
            {artisan.uploadedReports && artisan.uploadedReports.length > 0 ? (
              <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              {artisan.uploadedReports.map((report, index) => (
                <Button
                  key={index}
                  variant="contained" 
                  href={report.downloadURL}
                  sx={{
                    marginBottom: 1,
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    '&:hover': {
                      backgroundColor: '#1565c0', 
                    },
                    fontSize: '0.9rem', 
                    padding: '10px 20px', 
                    textTransform: 'none', 
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)', 
                  }}
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  {report.name}
                </Button>
              ))}
            </MDBox>
            
            ) : (
              <MDTypography variant="body1" color="textPrimary" mb={2}>
                No reports uploaded.
              </MDTypography>
            )}
          </Card>
        </MDBox>
      </DialogContent>

      {/* Dialog Actions Section */}
      <DialogActions>
        <MDBox p={2} display="flex" justifyContent="center" width="100%">
          <Button
            onClick={onClose}
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

export default ArtisanDetailsDialog;
