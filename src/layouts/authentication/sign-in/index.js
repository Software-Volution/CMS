import React, { useState } from "react";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import Checkbox from "@mui/material/Checkbox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Basic() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    if (selectedRole === "admin" && formData.email !== "ayankson72@gmail.com"){
      return alert("You are not an admin")
    }

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
        // Fetch the user's role from Firestore
        const userDocRef = doc(db, selectedRole, user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("User role:", userDocSnap.data().role);
          if (selectedRole === "students") {
            navigate("/layouts/student/Student");
          } else if (selectedRole === "artisans") {
            navigate("/authentication/artisan");
          }else{
            navigate("/layouts/admin/admindashboard");
          }
      }
    } catch (error) {
      console.error("Error signing in: ", error);
      alert("Error signing in. Please check your email and password.");
    }
  };

  return (
    <CoverLayout image={bgImage} className="brighter-background">
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome back
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <div style={{ display: "flex" }}>
              <MDBox display="flex" alignItems="center">
                <Radio value="admin" checked={selectedRole === "admin"} onChange={handleRoleChange} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Admin&nbsp;
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center">
                <Radio value="students" checked={selectedRole === "students"} onChange={handleRoleChange} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Student&nbsp;
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center">
                <Radio value="artisans" checked={selectedRole === "artisans"} onChange={handleRoleChange} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Artisan&nbsp;
                </MDTypography>
              </MDBox>
            </div>
            <MDBox mb={2}>
              <MDInput type="email" label="Email" variant="standard" fullWidth name="email" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2} display="flex" alignItems="center">
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="standard"
                fullWidth
                name="password"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign In
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign Up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Basic;
