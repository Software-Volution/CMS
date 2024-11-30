import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/trial.avif";

// Firebase imports
import { auth, db } from "layouts/authentication/firebase-config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: "",
    role: "Senior Hall Tutor/ Legon hall",
  });

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     * The event listener that's calling the handleTabsOrientation function when resizing the window.
     */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Fetch profile data based on the logged-in user
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const email = user.email;

      try {
        // Query students collection
        const studentQuery = query(
          collection(db, "students"),
          where("email", "==", email)
        );
        const studentSnapshot = await getDocs(studentQuery);
        if (!studentSnapshot.empty) {
          const studentData = studentSnapshot.docs[0].data();
          setProfileData({
            name: studentData.name,
            role: "Student",
          });
          return;
        }

        // Query artisans collection
        const artisanQuery = query(
          collection(db, "artisans"),
          where("email", "==", email)
        );
        const artisanSnapshot = await getDocs(artisanQuery);
        if (!artisanSnapshot.empty) {
          const artisanData = artisanSnapshot.docs[0].data();
          setProfileData({
            name: artisanData.name,
            role: "Artisan",
          });
          return;
        }

        // Query admin collection (default role is "Senior Hall Tutor/ Legon hall")
        const adminQuery = query(
          collection(db, "admin"),
          where("email", "==", email)
        );
        const adminSnapshot = await getDocs(adminQuery);
        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setProfileData({
            name: adminData.name,
            role: "Senior Hall Tutor/ Legon hall",
          });
          return;
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      >
      </MDBox>
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
              {profileData.name}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {profileData.role}
              </MDTypography>
            </MDBox>
          </Grid>
          {<Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
          </Grid>}
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
