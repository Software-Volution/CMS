import Tables from "./layouts/tables";
import Complaint from "./layouts/Complaints";
import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import Icon from "@mui/material/Icon";
import Artisan from "./layouts/artisan/artisan";
import Report from "./layouts/artisan/Report";
import Request from "./layouts/artisan/Request";
import Student from "./layouts/student/Student";
import LComplaint from "./layouts/student/LComplaint"; // Adjust the path as necessary
import Complaints from"./layouts/student/Complaints";
import SProfile from"./layouts/student/SProfile";
import Dashboard from "./layouts/dashboard";
import ArtProfile from "./layouts/artisan/aprofile"
import StudentNotifications from "layouts/notifications/sub/studentNotification";
import ArtisanNotifications from "layouts/notifications/sub/artisanNotification";


const mainRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Manage Users",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Complaints",
    key: "Complaints",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/Complaints",
    component: <Complaints />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

const artisanRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "Artisan",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/artisan",
    component: <Artisan />,
  },

  {
    type: "collapse",
    name: "Job Request",
    key: "Request",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/artisan/Request",
    component: <Request />, // Add new route for ArtisanRequest
  },

  {
    type: "collapse",
    name: "Upload Report",
    key: "Report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/artisan/report",
    component: <Report />, // Add new route for ArtisanRequest
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications/sub/artisanNotification",
    component: <ArtisanNotifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/authentication/artisan/profile",
    component: <ArtProfile />,
  },
  

  
];

const studentRoutes = [
  {
    type: "collapse",
    name: "Student",
    key: "Student",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "layouts/student/Student",
    component: <Student />,
  },

  {
    type: "collapse",
    name: "LComplaint",
    key: "LComplaint",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/student/LComplaint",
    component: <LComplaint/>, // Add new route for ArtisanRequest
  },

  {
    type: "collapse",
    name: "Complaints",
    key: "Complaints",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/student/Complaints",
    component: <Complaint />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "SProfile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/student/SProfile",
    component: <SProfile />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications/sub/studentNotification",
    component: <StudentNotifications />,
  },
  
  

];
  // Admin routes
const adminRoutes = [
  {
    type: "collapse",
    name: "dashboard",
    key: "admindashboard",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/layouts/admindashboard",
    component: <adminDashboard />,
  },
];

export { mainRoutes, artisanRoutes, studentRoutes, adminRoutes };

  


