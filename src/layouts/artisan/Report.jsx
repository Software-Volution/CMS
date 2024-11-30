import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumbs from 'examples/Breadcrumbs';

import Snackbar from '@mui/material/Snackbar';  
import Alert from '@mui/material/Alert'; 

import { getDocs, where, collection, query, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from 'layouts/authentication/firebase-config/firebase'; 



const storage = getStorage();


const Report = () => {
  const [files, setFiles] = useState(() => {
    // Retrieve files from localStorage if available
    const savedFiles = localStorage.getItem('uploadedFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const [email, setEmail] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

      // Fetch the authenticated user's email from Firebase Auth
  useEffect(() => {
    const fetchUserEmail = () => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email);
      } else {
        console.error('No user is currently logged in');
      }
      setLoadingEmail(false); 
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = async (event) => {
    if (loadingEmail || !email) {
      setSnackbarMessage('Email not available yet. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const uploadedFiles = Array.from(event.target.files);

    try {
      const q = query(collection(db, 'artisans'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No artisan document found with the given email.');
      }

      const artisanDoc = querySnapshot.docs[0];
      const artisanRef = artisanDoc.ref;

      const fileUploadPromises = uploadedFiles.map(async (file) => {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return { name: file.name, downloadURL };
      });

      const uploadedFileData = await Promise.all(fileUploadPromises);

      await updateDoc(artisanRef, {
        uploadedReports: arrayUnion(...uploadedFileData),
      });

      setFiles((prevFiles) => [...prevFiles, ...uploadedFileData]);
      setSnackbarMessage('File(s) uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading files:', error);
      setSnackbarMessage(`Failed to upload file(s): ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleFileRemove = async (fileToRemove) => {
    try {
      if (!email) {
        throw new Error('Email is not defined.');
      }

      const q = query(collection(db, 'artisans'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No artisan document found with the given email.');
      }

      const artisanDoc = querySnapshot.docs[0];
      const artisanRef = artisanDoc.ref;

      const updatedReports = artisanDoc.data().uploadedReports.filter((report) => report.name !== fileToRemove.name);

      await updateDoc(artisanRef, {
        uploadedReports: updatedReports,
      });

      setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name));
      setSnackbarMessage('File removed successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing file:', error);
      setSnackbarMessage('Failed to remove file.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };



  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '100vh',
        marginLeft: '45%', // Adjust this to move content away from the sidenav
        transform: 'translateX(-50%)', // Center the content
        padding: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200, marginBottom: 2 }}>
        <Breadcrumbs 
          icon="home" 
          title="Upload Report" 
          route={["home", "upload-report"]} 
        />
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1200 }}> {/* Adjusted the maxWidth to make the paper bigger */}
        
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 10,
            height: '50vh',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding shadow to make the Paper pop out
            transition: 'all 0.3s ease-in-out', // Smooth transition for hover effect
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Enhance shadow on hover
            },
          }}
        >
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              width: '100%',
              height: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: 4,
              backgroundColor: '#fafafa', // Slightly different background color for the upload area
              '&:hover': {
                backgroundColor: '#f0f0f0', // Slightly darker on hover
              },
            }}
          >
            <label htmlFor="upload-file-input" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <CloudUploadIcon fontSize="large" />
              <Typography>Drag and drop or Choose files</Typography>
              <Typography variant="caption">Maximum size: 5MB</Typography>
            </label>
            <input
              id="upload-file-input"
              type="file"
              style={{ display: 'none' }}
              multiple
              onChange={handleFileUpload}
            />
          </Box>
          {files.length > 0 && (
            <Box sx={{ width: '100%' }}>
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    marginTop: 2,
                    justifyContent: 'space-between',
                    backgroundColor: '#f9f9f9', // Background color for each file item
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginRight: 2,
                    }}
                  >
                    <Typography>{file.name}</Typography>
                    <Typography variant="caption">Download safe and secure file.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <Button
    variant="outlined"
    size="small" // Set the button size to small
    sx={{
      marginRight: 2,
      padding: '4px 8px', // Adjust padding for smaller size
      backgroundColor: 'light-blue',
      '&:hover': {
        backgroundColor: 'light-blue',
      },
    }}
  >
    <Typography sx={{ fontWeight: 'small', color: 'blue', fontSize: '0.875rem' }}>Download</Typography>
  </Button>
  <IconButton onClick={() => handleFileRemove(file)}>
    <DeleteIcon fontSize="medium" />
  </IconButton>
</Box>

                    
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report;
