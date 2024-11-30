
import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "layouts/authentication/firebase-config/firebase";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function EditProfileForm({ artisanId, onClose, onSave }) {
  const [profileData, setProfileData] = useState({
    title: "",
    name: "",
    phone: "",
    email: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(collection(db, "artisans"), artisanId); // Fetch from artisans collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchProfile();
  }, [artisanId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(collection(db, "artisans"), artisanId); // Save to artisans collection
      await updateDoc(docRef, profileData);
      onSave(profileData); 
      onClose(); 
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <MDBox>
      <MDTypography variant="h5" mb={2}>
        Edit Profile
      </MDTypography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title" 
              name="title"
              value={profileData.title}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"  
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              multiline
              rows={4}  
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
            <Button onClick={onClose} variant="contained" color="secondary" style={{ marginLeft: 10 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MDBox>
  );
}

export default EditProfileForm;
