// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable"; // Ensure DataTable is imported

// Data
import CustomTableData from "layouts/Complaints/data/index.js";
import ComplaintDetailsDialog from "layouts/tables/data/dialogBox/ComplaintDetailsDialog";

function Tables() {
  const { 
    columns, 
    rows, 
    openDialog, 
    selectedComplaint, 
    handleCloseDialog,
    setOpenDialog,
    setSelectedComplaint 
   } = CustomTableData();


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
         <ComplaintDetailsDialog
         open={openDialog} 
         handleClose={handleCloseDialog} 
         complaint={selectedComplaint}
       />
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
