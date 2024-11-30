import React, {useState, useEffect} from 'react';
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

//firebase
import { getDocs, collection, doc, getDoc, query, where } from "firebase/firestore";
import { db, auth } from "layouts/authentication/firebase-config/firebase"; // Import Firebase configuration
import { getAuth, onAuthStateChanged } from "firebase/auth";


// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import StudentProjects from "layouts/dashboard/components/Projects/student/studentProject";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

export default function Student() {

  const [complaintsCount, setComplaintsCount] = useState(0); 
  const [userEmail, setUserEmail] = useState(null); 
  const [studentName, setStudentName] = useState(null);
  const [resolvedComplaintsCount, setResolvedComplaintsCount] = useState(0); 
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState(0);
  


    // Fetch logged-in user's email
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email); 
        }
      });
  
      return () => unsubscribe(); 
    }, []);

  

      // Fetch the student's name using the email
  useEffect(() => {
    const fetchStudentName = async () => {
      if (userEmail) {
        try {
          const studentsQuery = query(
            collection(db, "students"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(studentsQuery);
          
          if (!querySnapshot.empty) {
            const studentDoc = querySnapshot.docs[0].data();
            setStudentName(studentDoc.name);
          } else {
            console.error("No student found with the email:", userEmail);
          }
        } catch (error) {
          console.error("Error fetching student name:", error);
        }
      }
    };
    fetchStudentName();
  }, [userEmail]);

    // Fetch complaints count based on student name
    useEffect(() => {
      const fetchComplaintsCount = async () => {
        if (studentName) {
          try {
            const complaintsQuery = query(
              collection(db, "complaints"),
              where("name", "==", studentName)
            );
            const querySnapshot = await getDocs(complaintsQuery);
            setComplaintsCount(querySnapshot.size);
          } catch (error) {
            console.error("Error fetching complaints:", error);
          }
        }
      };
  
      fetchComplaintsCount();
    }, [studentName]); 

    
  useEffect(() => {
    const fetchResolvedComplaints = async () => {
      if (studentName) {
        try {
          const resolvedComplaintsQuery = query(
            collection(db, "complaints"),
            where("name", "==", studentName),
            where("status", "==", "Accepted by Artisan")
          );
          const resolvedSnapshot = await getDocs(resolvedComplaintsQuery);
          setResolvedComplaintsCount(resolvedSnapshot.size); // Set the resolved complaints count
        } catch (error) {
          console.error("Error fetching resolved complaints:", error);
        }
      }
    };

    fetchResolvedComplaints();
  }, [studentName]);


  useEffect(() => {
    const fetchPendingComplaints = async () => {
      if (studentName) {
        try {
          const pendingComplaintsQuery = query(
            collection(db, "complaints"),
            where("name", "==", studentName),
            where("status", "==", "Open") // Check if the status is "Open"
          );
          const pendingSnapshot = await getDocs(pendingComplaintsQuery);
          setPendingComplaintsCount(pendingSnapshot.size); 
        } catch (error) {
          console.error("Error fetching pending complaints:", error);
        }
      }
    };
  
    fetchPendingComplaints();
  }, [studentName]);
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Complaints"
                count={complaintsCount}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Resolved"
                count={resolvedComplaintsCount}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} >
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Pending"
                count={pendingComplaintsCount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
            <StudentProjects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
