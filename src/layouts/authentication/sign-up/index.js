import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/hannah-murrell-ma3ivTHdyxU-unsplash.jpg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, query, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";

function Cover() {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    residence: "",
    roomNo: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

    // Function to check if the provided student data matches the verification collection
    const checkStudentVerification = async (formData) => {
      const verificationQuery = query(
        collection(db, "students_verification"),
        where("email", "==", formData.email),
        where("name", "==", formData.name),
        where("id", "==", formData.id),
        where("residence", "==", formData.residence),
        where("roomNo", "==", formData.roomNo),
        where("phone", "==", formData.phone)
      );
  
      const querySnapshot = await getDocs(verificationQuery);
  
      // If a match is found, return true
      if (!querySnapshot.empty) {
        return true;
      } else {
        return false;
      }
    };

  // "ayankson72@gmail.com", "admin123"
  // const handleSignup = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, "ayankson72@gmail.com", "admin123");
  //     const user = userCredential.user;

  //     await setDoc(doc(db, "admin", user.uid), {
  //       name: "Alfred Yankson",
  //       email: "ayankson72@gmail.com",
  //       phone: "0246582242",
  //       role: "admin"
  //     });

  //     alert("Account created successfully!");

  //     setFormData({
  //       name: "",
  //       id: "",
  //       email: "",
  //       password: "",
  //       residence: "",
  //       roomNo: "",
  //       phone: "",
  //     });

  //     // Navigate to the sign-in page
  //     navigate("/authentication/sign-in");
  //   } catch (error) {
  //     console.log(error);
  //     if (error.code === "auth/email-already-in-use") {
  //       alert("Email already in use. Please use a different email.");
  //     } else {
  //       console.error("Error signing up: ", error);
  //     }
  //   }
  // };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      // Check if the student's details match the verification data
      const isVerified = await checkStudentVerification(formData);

      if (!isVerified) {
        alert("Your details do not match our records. Please check and try again.");
        
        return;  // Exit the function if details don't match
      }

      // Proceed with creating the user if verified
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save the student's details in the "students" collection
      await setDoc(doc(db, "students", user.uid), {
        name: formData.name,
        id: formData.id,
        email: formData.email,
        residence: formData.residence,
        roomNo: formData.roomNo,
        phone: formData.phone,
      });

      alert("Account created successfully!");

      // Clear form data
      setFormData({
        name: "",
        id: "",
        email: "",
        password: "",
        residence: "",
        roomNo: "",
        phone: "",
      });

      // Navigate to the sign-in page
      navigate("/authentication/sign-in");

    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use. Please use a different email.");
      } else {
        console.error("Error signing up: ", error);
      }
    }
  };


  return (
    <CoverLayout image={bgImage}>
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
            Welcome Student!
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your credentials to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignup}>
            <MDBox mb={2}>
              <MDInput type="text" label="Name" variant="standard" fullWidth name="name" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="number" label="ID" variant="standard" fullWidth name="id" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" label="Student Email" variant="standard" fullWidth name="email" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" variant="standard" fullWidth name="password" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                select
                label="Place of Residence"
                variant="standard"
                fullWidth
                name="residence"
                onChange={handleChange}
                value={formData.residence}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Main Hall">Main Hall</MenuItem>
                <MenuItem value="Annex A">Annex A</MenuItem>
                <MenuItem value="Annex B">Annex B</MenuItem>
                <MenuItem value="Annex C">Annex C</MenuItem>
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Room No" variant="standard" fullWidth name="roomNo" onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="number" label="Phone" variant="standard" fullWidth name="phone" onChange={handleChange} />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton onClick={handleSignup} variant="gradient" color="info" fullWidth type="submit">
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
