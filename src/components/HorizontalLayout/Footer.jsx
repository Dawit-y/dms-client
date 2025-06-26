import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  // const storedUser = localStorage.getItem("authUser");
  // const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  // const [userProfile, setUserProfile] = useState(User);
  // const userDetail = userProfile.user.user_detail;
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>
              {2025} -- {'Department'}
            </Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                {'Company Name'}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};
export default Footer;
