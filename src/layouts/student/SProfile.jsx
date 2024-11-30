// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable"; // Ensure DataTable is imported
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import PlatformSettings from "layouts/profile/components/PlatformSettings";

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "layouts/authentication/firebase-config/firebase";

import StudentEditProfileForm from "./SProfile/Component/editProfile/StudentEditProfileForm";

import React, {useEffect, useState} from 'react'

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import Header from "./SProfile/Component/Header";

// Data

function Tables() {
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    phone: "",
    email: "",
    roomNo: "",
    residence: "",
    description: "",
    status: "Student"
  });

  const [openEditForm, setOpenEditForm] = useState(false);
  const [studentId, setStudentId] = useState(null);

    // Fetch student details from Firebase when component mounts
    useEffect(() => {
      const fetchStudentData = async () => {
        try {
          const studentQuerySnapshot = await getDocs(collection(db, "students"));
          if (!studentQuerySnapshot.empty) {
            const studentDoc = studentQuerySnapshot.docs[0]; // Fetching first student as an example
            setStudentId(studentDoc.id); // Set the student document ID
            
            // Set profile info state with fetched Firebase data
            setProfileInfo({
              name: studentDoc.data().name,
              phone: studentDoc.data().phone,
              email: studentDoc.data().email,
              roomNo: studentDoc.data().roomNo,
              residence: studentDoc.data().residence,
              description: studentDoc.data().description || "", 
              status: studentDoc.data().status || "Student"
            });
          } else {
            console.log("No student found");
          }
        } catch (error) {
          console.error("Error fetching student data: ", error);
        }
      };
  
      fetchStudentData();
    }, []);

      // Open Edit Form
  const handleEditClick = () => {
    setOpenEditForm(true);
  };

  // Close Edit Form
  const handleClose = () => {
    setOpenEditForm(false);
  };

  const handleProfileUpdate = async (updatedInfo) => {
    try {
      const studentRef = doc(db, "students", studentId);
      await updateDoc(studentRef, updatedInfo);


      setProfileInfo(updatedInfo);
      handleClose(); 
    } catch (error) {
      console.error("Error updating student profile: ", error);
    }
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
              {studentId && (
                <ProfileInfoCard
                  title="Profile Information"
                  description={profileInfo.status}
                  info={""}
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
                  action={{ route: "", tooltip: "Edit Profile", onClick: handleEditClick }}
                  shadow={false}
                />
              )}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>

            {/* Empty Profile Card for consistent layout */}
            <Grid item xs={12} xl={4} sx={{ mt: -12 }}>
              <ProfileInfoCard
                title={""}
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
                action={{ route: "", tooltip: "Edit Profile", onClick: handleEditClick }}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Edit Profile Dialog */}
        <Dialog open={openEditForm} onClose={handleClose}>
          <DialogContent>
            <StudentEditProfileForm
              studentId={studentId}
              profileInfo={profileInfo}
              onClose={handleClose}
              onSave={handleProfileUpdate}
            />
          </DialogContent>
        </Dialog>
      </Header>
    </DashboardLayout>
  );
}


export default Tables;
