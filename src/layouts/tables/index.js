import React, { useEffect, useState } from 'react';
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable"; // Ensure DataTable is imported

import ArtisanDetailsDialog from './data/dialogBox/artisanDetailsDialog';
import StudentDetailsDialog from './data/dialogBox/studentDetailsDialog';

// Data
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, functions } from 'layouts/authentication/firebase-config/firebase';
import { collection, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from 'layouts/authentication/firebase-config/firebase';
import authorsTableData from './data/authorsTableData';
import projectsTableData from './data/projectsTableData';
import { httpsCallable, getFunctions } from 'firebase/functions';







function Tables() {

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);


  

  // State variables for dialogs and form fields
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [work, setWork] = useState('');
  const [artisans, setArtisans] = useState([]);
  const [students, setStudents] = useState([]);

  const handleOpenRoleDialog = () => setOpenRoleDialog(true);
  const handleCloseRoleDialog = () => setOpenRoleDialog(false);

  
  const handleViewClick = (artisan) => {
    setSelectedArtisan(artisan)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedArtisan(null)
  }

    // Handle Student View Click
    const handleStudentViewClick = (student) => {
      setSelectedStudent(student);
      setOpenStudentDialog(true);
    };

    const handleCloseStudentDialog = () => {
      setOpenStudentDialog(false);
      setSelectedStudent(null);
    };


  const handleRoleSubmit = () => {
    setOpenRoleDialog(false);
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => setOpenAddUserDialog(false);

  

  const getArtisans = async (collectionName) => {
    try {
      const users = query(collection(db, collectionName));
      const userSnapshot = await getDocs(users);

      const usersList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtisans(usersList)

    } catch (error) {
      console.log("error occured >>>",error)
    }
  }

  const handleAddArtisan = async () => {
    try {
      const randomPassword = generateRandomPassword();
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, randomPassword);
      const user = userCredential.user;
      
      await setDoc(doc(db, "artisans", user.uid), {
        name,
        email,
        work,
      });
  
      const sendPasswordEmail = httpsCallable(functions, "sendPasswordEmail");
      await sendPasswordEmail({ email, password: randomPassword });
      
  
      alert("User successfully created. Password sent via email");
      await getArtisans("artisans");
      setOpenAddUserDialog(false);
    } catch (error) {
      console.error("Error adding artisan:", error);
      alert("Failed to create user or send email: " + error.message);
      setOpenAddUserDialog(false)
    }
  };

  useEffect(() => {
    getArtisans("artisans")
  }, [])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, "students"); // Ensure "students" collection exists in Firestore
        const studentSnapshot = await getDocs(studentsCollection);
        const studentsList = studentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
  
        console.log("Fetched Students:", studentsList); // Add this to verify if students data is fetched
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
  
    fetchStudents();
  }, []);
  
  
  const { columns: authorsColumns, rows: authorsRows } = authorsTableData(artisans, handleViewClick);
  const { columns: projectsColumns, rows: projectsRows } = projectsTableData(students, handleStudentViewClick);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8)
  }

  


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} mt={-7}>
        <Grid container spacing={6} justifyContent="flex-start">
          <Grid item>
            <Button variant="contained" color="success" onClick={handleOpenRoleDialog}>
              Add User
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} mt={2}>
            <Card>
              <MDBox
                mx={2}
                mt={-1}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Artisans
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: authorsColumns, rows: authorsRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                
              </MDBox>
            </Card>
          </Grid>

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
                  Students
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: projectsColumns, rows: projectsRows }}
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

      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
        <DialogTitle>Select Role</DialogTitle>
        <DialogContent>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
      
            <MenuItem value="artisan">Artisan</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRoleSubmit} color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogTitle>Add {role.charAt(0).toUpperCase() + role.slice(1)}</DialogTitle>
        <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
        
          {role === "artisan" && (
             <FormControl fullWidth margin="dense">
              <InputLabel>Work</InputLabel>
              <Select
                value={work}
                onChange={(e) => setWork(e.target.value)}
                variant="standard"
              >
                <MenuItem value="plumbing">Plumber</MenuItem>
                <MenuItem value="electric">Electrician</MenuItem>
                <MenuItem value="Fumigation">Fumigator</MenuItem>
                <MenuItem value="Carpentry">Carpenter</MenuItem>
              </Select>
            </FormControl>
          )}


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddArtisan} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Artisan Details Dialog */}
      <ArtisanDetailsDialog open={openDialog} onClose={handleCloseDialog} artisan={selectedArtisan} />
       {/* Student Details Dialog */}
       <StudentDetailsDialog open={openStudentDialog} onClose={handleCloseStudentDialog} student={selectedStudent} />
    </DashboardLayout>
  );
}

export default Tables;
