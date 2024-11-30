import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
//import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import ArtisanProjects from "layouts/dashboard/components/Projects/artisan/artisanProject";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

//firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "layouts/authentication/firebase-config/firebase";
import { onAuthStateChanged } from "firebase/auth";

function Dashboard() {


  const [complaintsCount, setComplaintsCount] = useState(0); 
  const [totalUsersCount, setTotalUsersCount] = useState(0); 
  const [artisanWorkType, setArtisanWorkType] = useState(null); 
  const [userEmail, setUserEmail] = useState(null); 
  const [resolvedComplaintsCount, setResolvedComplaintsCount] = useState(0);
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    
    const fetchArtisanWorkType = async () => {
      if (userEmail) {
        try {
          const artisanQuery = query(
            collection(db, "artisans"),
            where("email", "==", userEmail)
          );
          const artisanSnapshot = await getDocs(artisanQuery);

          if (!artisanSnapshot.empty) {
            const artisanDoc = artisanSnapshot.docs[0].data();
            setArtisanWorkType(artisanDoc.work); 
          }
        } catch (error) {
          console.error("Error fetching artisan details:", error);
        }
      }
    };

    fetchArtisanWorkType();
  }, [userEmail]);


  useEffect(() => {
    
    const fetchComplaintsCount = async () => {
      if (artisanWorkType) {
        try {
          const complaintsQuery = query(
            collection(db, "complaints"),
            where("issueType", "==", artisanWorkType) 
          );
          const complaintsSnapshot = await getDocs(complaintsQuery);
          setComplaintsCount(complaintsSnapshot.size); 
        } catch (error) {
          console.error("Error fetching complaints:", error);
        }
      }
    };

    fetchComplaintsCount();
  }, [artisanWorkType]);

  useEffect(() => {
    
    const fetchTotalUsersCount = async () => {
      try {
        const artisansSnapshot = await getDocs(collection(db, "artisans"));
        const studentsSnapshot = await getDocs(collection(db, "students"));

        const totalUsers = artisansSnapshot.size + studentsSnapshot.size; 
        setTotalUsersCount(totalUsers);
      } catch (error) {
        console.error("Error fetching total users count:", error);
      }
    };

    fetchTotalUsersCount();
  }, []);

  useEffect(() => {
    
    const fetchResolvedComplaintsCount = async () => {
      if (artisanWorkType) {
        try {
          const resolvedComplaintsQuery = query(
            collection(db, "complaints"),
            where("issueType", "==", artisanWorkType), 
            where("status", "==", "Accepted by Artisan") 
          );
          const resolvedSnapshot = await getDocs(resolvedComplaintsQuery);
          setResolvedComplaintsCount(resolvedSnapshot.size); 
        } catch (error) {
          console.error("Error fetching resolved complaints:", error);
        }
      }
    };

    fetchResolvedComplaintsCount();
  }, [artisanWorkType]);

  useEffect(() => {
    const fetchPendingComplaintsCount = async () => {
      if (artisanWorkType) {
        try {
          
          const pendingComplaintsQuery = query(
            collection(db, "complaints"),
            where("issueType", "==", artisanWorkType),
            where("status", "==", "Accepted") 
          );
          const pendingSnapshot = await getDocs(pendingComplaintsQuery);
          setPendingComplaintsCount(pendingSnapshot.size); 
        } catch (error) {
          console.error("Error fetching pending complaints:", error);
        }
      }
    };

    fetchPendingComplaintsCount();
  }, [artisanWorkType]);


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
                  label: "than lask week",
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
            <MDBox mb={1.5}>
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
        {/* <MDBox mt={4.5}></MDBox> */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <ArtisanProjects />
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

export default Dashboard;
