import React, {useState, useEffect} from "react";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";
import { Feedback } from "@material-ui/icons";


import { db, auth } from "layouts/authentication/firebase-config/firebase";
import {collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@mui/material";

function CustomComplaintsData({onViewClick, onFeedbackClick}) {
  const columns = [
    
    { Header: "type", accessor: "type" },
    { Header: "description", accessor: "description" },
    { Header: "date", accessor: "date" },
    { Header: "status", accessor: "status" },
    { Header: "action", accessor: "action" },
    {Header: "severity", accessor: "severity"},
    { Header: "Feedback", accessor: "feedback" },
    
  ];

  const [rows, setRows] = useState([])
  const [userEmail, setUserEmail] = useState(null); // State for user email
  const [studentName, setStudentName] = useState(null); // State for student name
  

    // Fetch logged-in user's email
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email); 
        }
      });
  
      return () => unsubscribe(); 
    }, []);

      // Fetch the student's name using their email
  useEffect(() => {
    const fetchStudentName = async () => {
      if (userEmail) {
        try {
          const studentsQuery = query(
            collection(db, "students"),
            where("email", "==", userEmail)
          );
          const querySnapshot = await getDocs(studentsQuery);

          if (!querySnapshot.empty) {
            const studentDoc = querySnapshot.docs[0].data();
            setStudentName(studentDoc.name);
          } else {
            console.error("No student found with the email:", userEmail);
          }
        } catch (error) {
          console.error("Error fetching student name:", error);
        }
      }
    };

    fetchStudentName();
  }, [userEmail]);


  // Fetch complaints for the specific student
  useEffect(() => {
    const fetchComplaints = async () => {
      if (studentName) {
        const complaintsQuery = query(
          collection(db, "complaints"),
          where("name", "==", studentName)
        );

        const querySnapshot = await getDocs(complaintsQuery);
        const complaintsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          complaintsData.push({
            type: <MDTypography variant="caption">{data.issueType}</MDTypography>,
            description: <MDTypography variant="caption">{data.description}</MDTypography>,
            date: <MDTypography variant="caption">{data.date.toDate().toLocaleDateString()}</MDTypography>,
            status: (
              <MDBox ml={-1}>
                <MDBadge badgeContent={data.status} color="success" variant="gradient" size="sm" />
              </MDBox>
            ),
            
            feedback: <Feedback style={{ fontSize: 20 }} />,  
            action: <Button color="info" onClick={() => onViewClick({ ...data, id: doc.id })} >View</Button>,
            feedback: (
              <Button color="primary" onClick={() => onFeedbackClick({ ...data, id: doc.id })}>
                 Feedback
              </Button>
            ),
            severity: <MDTypography variant="caption">{data.severity}</MDTypography>,
          });
        });

        setRows(complaintsData);
      }
    };

    fetchComplaints();
  }, [studentName]);


return { columns, rows };
}

export default CustomComplaintsData;

