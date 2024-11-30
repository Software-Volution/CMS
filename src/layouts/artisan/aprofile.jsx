import React, {useState, useEffect} from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "layouts/authentication/firebase-config/firebase";

import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

import EditProfileForm from 'layouts/profile/components/editProfile/ArtisanEditProfile';

const ArtProfile =() => {

      // State to track profile information
  const [profileInfo, setProfileInfo] = useState({
    title: "Profile Information",
    name: "",
    phone: "",
    email: "",
    location: "",
    description: ""
  });

  const [openEditForm, setOpenEditForm] = useState(false);
  const [artisanId, setArtisanId] = useState(null);


    // Fetch the artisan details from Firebase when component mounts
    useEffect(() => {
        const fetchArtisanData = async () => {
          try {
            const artisanQuerySnapshot = await getDocs(collection(db, "artisans"));
            if (!artisanQuerySnapshot.empty) {
              const artisanDoc = artisanQuerySnapshot.docs[0]; // Assuming there's only one artisan for now
              setArtisanId(artisanDoc.id); // Set the artisan document ID
              
              // Set profile info state with fetched Firebase data
              setProfileInfo({
                name: artisanDoc.data().name,
                phone: artisanDoc.data().phone,
                email: artisanDoc.data().email,
                location: artisanDoc.data().location,
                description: artisanDoc.data().description,
              });
            } else {
              console.log("No artisan found");
            }
          } catch (error) {
            console.error("Error fetching artisan data: ", error);
          }
        };
    
        fetchArtisanData();
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
                  {artisanId && (<ProfileInfoCard
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
           
          </Header>
           {/* Edit Profile Dialog */}
           <Dialog open={openEditForm} onClose={handleClose}>
            <DialogContent>
              <EditProfileForm
                artisanId={artisanId}
                onClose={handleClose}
                onSave={handleProfileUpdate} // Pass update handler
              />
            </DialogContent> 
          </Dialog>
        </DashboardLayout>
      );
    }

export default ArtProfile