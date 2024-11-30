import React, { useState } from "react";
import { Grid, TextField, MenuItem, Button, Box, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card"; // Import Card component
import { collection, addDoc, where, query, getDocs } from 'firebase/firestore';
import { db } from "layouts/authentication/firebase-config/firebase";

import { useNavigate } from "react-router-dom";


// Data for dropdowns
const issueTypes = [
  { value: "electric", label: "Electric" },
  { value: "plumbing", label: "Plumber" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "Fumigation", label: "Fummigation" },
];

const blocks = [
  { value: "M", label: "Main hall" },
  { value: "A", label: "Annex A" },
  { value: "B", label: "Annex B" },
  { value: "C", label: "Annex C" },
];

const severityLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const titles = [
  { value: "electric", label: "Electric" },
  { value: "plumbing", label: "Plumber" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "Fumigation", label: "Fummigation" },
];

const LComplaint = ({appendNewComplaint}) => {

  const navigate = useNavigate(); 

  
  // Single state to manage all form fields
  const [inputData, setInputData] = useState({
    name: "",
    //email: "",
    roomNo: "",
    block: "",
    date: null,
    issueType: "",
    severity: "",
    title: "",
    description: "",
  });

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newComplaint = {
        name: inputData.name,
        roomNo: inputData.roomNo,
        block: inputData.block,
        date: inputData.date,
        issueType: inputData.issueType,
        severity: inputData.severity,
        title: inputData.title,
        description: inputData.description,
        status: "Open",
        feedback: "Pending",
      };

      
      await addDoc(collection(db, "complaints"), newComplaint);

      // Add notification for admin
    await addDoc(collection(db, "notifications"), {
      message: `New complaint from ${inputData.name} about ${inputData.issueType}`,
      type: "info",
      date: new Date(),
    });

     // Show alert
     alert("Complaint successfully submitted!");

     // Redirect to the Complaints page
     navigate("/student/Complaints");

      console.log("Complaint successfully submitted!");
      
      
      appendNewComplaint(newComplaint);

      

      // Clear the form fields
      setInputData({
        name: "",
        roomNo: "",
        block: "",
        date: null,
        issueType: "",
        severity: "",
        title: "",
        description: "",
      });
      alert("Form submitted. Please proceed.")
    } catch (e) {
      console.error("Error adding complaint: ", e);
    }
  };

  


  // Handle form input change for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
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
                  Lodge Complaint
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3} pb={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Name"
                          placeholder="Enter your name. Also ensure the name provided matches what you registered with"
                          value={inputData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="roomNo"
                          label="Room No"
                          placeholder="Enter your Room No"
                          value={inputData.roomNo}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          name="block"
                          label="Block"
                          placeholder="Select your Block"
                          value={inputData.block}
                          onChange={handleInputChange}
                          required
                          sx={{
                            // Increase the height of the TextField's clickable area
                            '& .MuiSelect-select': {
                              height: '61px', // Adjust the height here
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        >
                          {blocks.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <DatePicker
                          label="Date"
                          value={inputData.date}
                          onChange={(value) => setInputData({ ...inputData, date: value })}
                          renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          name="issueType"
                          label="Issue Type"
                          value={inputData.issueType}
                          onChange={handleInputChange}
                          required
                          sx={{
                            // Increase the height of the TextField's clickable area
                            '& .MuiSelect-select': {
                              height: '61px', // Adjust the height here
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        >
                          {issueTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          name="severity"
                          label="Severity Level"
                          value={inputData.severity}
                          onChange={handleInputChange}
                          required
                          sx={{
                            // Increase the height of the TextField's clickable area
                            '& .MuiSelect-select': {
                              height: '70px', // Adjust the height here
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        >
                          {severityLevels.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          name="title"
                          label="Title Description"
                          value={inputData.title}
                          onChange={handleInputChange}
                          required
                          sx={{
                            // Increase the height of the TextField's clickable area
                            '& .MuiSelect-select': {
                              height: '70px', // Adjust the height here
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        >
                          {titles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="description"
                          label="Description"
                          placeholder="Enter description"
                          value={inputData.description}
                          onChange={handleInputChange}
                          multiline
                          rows={4}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                          <Button color="primary" variant="contained" type="submit">
                            Submit
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </LocalizationProvider>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default LComplaint;
