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


//firebase
import { getDocs, collection, doc, getDoc, where } from "firebase/firestore";
import { db, auth } from "layouts/authentication/firebase-config/firebase"; // Import Firebase configuration
// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
//import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {

  const [complaintsCount, setComplaintsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [resolvedComplaintsCount, setResolvedComplaintsCount] = useState(0);
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState(0);

  useEffect(() => {
    const fetchComplaintsCount = async () => {
      try {
        const complaintsSnapshot = await getDocs(collection(db, "complaints"));
        setComplaintsCount(complaintsSnapshot.size); // Set the number of documents
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaintsCount();
  }, []);


  useEffect(() => {
    const fetchTotalUsersCount = async () => {
      try {
        
        const artisanSnapshot = await getDocs(collection(db, "artisan"));
        const studentSnapshot = await getDocs(collection(db, "students"));

        const artisanCount = artisanSnapshot.size;
        const studentCount = studentSnapshot.size; 

        
        setTotalUsersCount(artisanCount + studentCount);
      } catch (error) {
        console.error("Error fetching total users count:", error);
      }
    };

    fetchTotalUsersCount();
  }, []);

    
    useEffect(() => {
      const fetchResolvedComplaints = async () => {
        try {
          const resolvedComplaintsQuery = query(
            collection(db, "complaints"),
            where("status", "==", "Accepted by Artisan")
          );
          const resolvedComplaintsSnapshot = await getDocs(resolvedComplaintsQuery);
          setResolvedComplaintsCount(resolvedComplaintsSnapshot.size); 
        } catch (error) {
          console.error("Error fetching resolved complaints:", error);
        }
      };
  
      fetchResolvedComplaints();
    }, []);

    
  useEffect(() => {
    const fetchPendingComplaints = async () => {
      try {
        const pendingComplaintsQuery = query(
          collection(db, "complaints"),
          where("status", "==", "Open") 
        );
        const pendingComplaintsSnapshot = await getDocs(pendingComplaintsQuery);
        setPendingComplaintsCount(pendingComplaintsSnapshot.size); 
      } catch (error) {
        console.error("Error fetching pending complaints:", error);
      }
    };

    fetchPendingComplaints();
  }, []);

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
                icon="leaderboard"
                title="Total Users"
                count={totalUsersCount}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
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
              <Projects />
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
