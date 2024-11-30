// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";

// Update the projectsTableData.js to accept students data
export default function projectsTableData(students, handleViewClick) {
  const Project = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "students", accessor: "students", width: "30%", align: "left" },
      { Header: "RoomNo", accessor: "RoomNo", align: "left" },
      { Header: "id", accessor: "id", align: "center" },
      { Header: "details", accessor: "details", align: "center" },
    ],

    rows: students.map((student) => ({
      students: <Project name={student.name} />,
      RoomNo: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {student.roomNo}
        </MDTypography>
      ),
      id: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {student.id}
        </MDTypography>
      ),
      details: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => handleViewClick(student)}>
          View
        </MDTypography>
      ),
    })),
  };
}
