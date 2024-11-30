import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Main component for the dashboard navbar
function DashboardNavbar({ absolute, light, isMini }) {
  const navigate = useNavigate()
  const [navbarType, setNavbarType] = useState(); // State to manage navbar type (sticky/static)
  const [controller, dispatch] = useMaterialUIController(); // State and dispatch from Material UI Controller
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller; // Destructuring state variables from the controller
  const [openMenu, setOpenMenu] = useState(false); // State to manage the open/close state of the notification menu
  const route = useLocation().pathname.split("/").slice(1); // Get the current route path to display in breadcrumbs

  useEffect(() => {
    // Setting the navbar type (sticky or static) based on whether the navbar is fixed
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // Function to handle the transparency of the navbar on scroll
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    // Add an event listener to change the transparency of the navbar on scroll
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the function to set the initial state of the navbar
    handleTransparentNavbar();

    // Cleanup function to remove the event listener on component unmount
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // Toggles the mini sidenav when the menu button is clicked
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  // Opens or closes the configurator when the settings icon is clicked
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Opens the notification menu
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);

  // Closes the notification menu
  const handleCloseMenu = () => setOpenMenu(false);

  // Renders the notification menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      
    </Menu>
  );

  // Styles for the navbar icons, adjusting color based on light/dark mode
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType} // Position of the navbar (absolute or sticky/static)
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })} // Styles for the navbar
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> {/* Breadcrumbs showing the current route */}
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" /> {/* Search input field */}
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon> {/* User account icon */}
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                
                  {miniSidenav ? "menu_open" : "menu"} {/* Mini sidenav toggle button */}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                 {/* Configurator settings icon */}
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon onClick={() => navigate("/notifications")} sx={iconsStyle}>notifications</Icon> {/* Notification icon */}
              </IconButton>
              {renderMenu()} {/* Render the notification menu */}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;

