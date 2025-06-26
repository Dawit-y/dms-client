import React from 'react';
import { Link } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';

const ErrorElement = () => {
  //meta title
  document.title = '500 Error Page ';

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="account-pages my-5 pt-5">
            <Container>
              <Row>
                <Col lg="12">
                  <div className="text-center mb-5">
                    <h1 className="display-2 fw-medium">
                      5
                      <i className="bx bx-buoy bx-spin text-primary display-3" />
                      0
                    </h1>
                    <h4 className="text-uppercase">Internal Server Error</h4>
                    <div className="mt-5 text-center">
                      <Link className="btn btn-primary " to="/dashboard">
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ErrorElement;
