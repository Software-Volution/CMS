import React, {useEffect, useState} from 'react'
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';


// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Example components
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "layouts/authentication/firebase-config/firebase";

import EditProfileForm from "./components/editProfile/AdminEditProfileForm";

function Overview() {

  // State to track profile information
  const [profileInfo, setProfileInfo] = useState({
    title: "Profile Information",
    title: "Profile Information",
    name: "Dr. Alfred Ato Yankson",
    phone: "0502339673",
    email: "Jsmith@ug.edu.gh",
    location: "Accra",
    description: ""
  });

  const [openEditForm, setOpenEditForm] = useState(false);
  const [adminId, setAdminId] = useState(null)


   // Fetch the admin details from Firebase when component mounts
   useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const adminQuerySnapshot = await getDocs(collection(db, "admin"));
        if (!adminQuerySnapshot.empty) {
          const adminDoc = adminQuerySnapshot.docs[0]; // Fetching first admin, assuming there's only one
          setAdminId(adminDoc.id); // Set the admin document ID
          
          // Set profile info state with fetched Firebase data
          setProfileInfo({
            name: adminDoc.data().name,
            phone: adminDoc.data().phone,
            email: adminDoc.data().email,
            location: adminDoc.data().location,
            description: adminDoc.data().description,
          });
        } else {
          console.log("No admin found");
        }
      } catch (error) {
        console.error("Error fetching admin data: ", error);
      }
    };

    fetchAdminId();
  }, []);

    // Open Edit Form
    const handleEditClick = () => {
      setOpenEditForm(true);
    };

      // Close Edit Form
  const handleClose = () => {
    setOpenEditForm(false);
  };

  // Update profile info after edit form submission
  const handleProfileUpdate = (updatedInfo) => {
    setProfileInfo(updatedInfo);
    handleClose(); // Close the form after saving
  };

  const filteredProfileInfo = {
    name: profileInfo.name,
    phone: profileInfo.phone,
    email: profileInfo.email,
    location: profileInfo.location,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {adminId && (<ProfileInfoCard
                title="Profile Information"
                info={profileInfo}
                
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile", onClick: handleEditClick}}
                shadow={false}
              />
              )}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4} sx={{ mt: -12, }} // Adjust this value to match the vertical position of the second grid content
            >
              <ProfileInfoCard
                title={""}
                info={filteredProfileInfo}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile", onClick: handleEditClick}}
                // Pass an empty object to avoid the error and remove the edit icon
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
        {/* The Projects section is commented out */}
        {/* <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="Project #2"
                title="Modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "View Project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="Project #1"
                title="Scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "View Project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="Project #3"
                title="Minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "View Project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="Project #4"
                title="Gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "View Project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox> */}
      </Header>
       {/* Edit Profile Dialog */}
       <Dialog open={openEditForm} onClose={handleClose}>
        <DialogContent>
          <EditProfileForm
            adminId={adminId}
            onClose={handleClose}
            onSave={handleProfileUpdate} // Pass update handler
          />
        </DialogContent> 
      </Dialog>
    </DashboardLayout>
  );
}

export default Overview;

