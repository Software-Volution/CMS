// prop-types is a library for typechecking of props
import PropTypes from "prop-types";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
 

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;

  return (
    <MDBox position="absolute"  bottom={0} py={4} >
      
        
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
