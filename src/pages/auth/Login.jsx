import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Button,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

import {
  LOGIN_TITLE,
  FOOTER_TEXT,
  BUREAU_NAME,
  logo,
} from '../../constants/constantTexts';
import { post } from '../../helpers/axios';
import { setAuthData } from '../../store/auth/authSlice';

const loginUser = async (credentials) => await post('/token/', credentials);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(
        setAuthData({
          accessToken: data.access,
          userData: data.user,
        })
      );
      localStorage.setItem('I18N_LANGUAGE', 'en');
      localStorage.setItem('i18nextLng', 'en');
      setErrorMessage(null);
      navigate('/dashboard');
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        setErrorMessage('Incorrect email or password. Please try again.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    },
  });

  const validation = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
      // .min(8, 'Password should be at least 8 characters long'),
    }),
    onSubmit: async (values) => await mutation.mutateAsync(values),
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary-subtle">
                <Row>
                  <Col xs={12} className="text-center mt-2">
                    <img
                      src={logo}
                      alt="logo"
                      className="img-fluid"
                      height={100}
                      width={100}
                    />
                  </Col>
                  <Col xs={12}>
                    <div className="text-primary p-4 text-center">
                      <h4>{BUREAU_NAME}</h4>
                      <h4>{LOGIN_TITLE}</h4>
                    </div>
                  </Col>
                </Row>
              </div>
              <Card.Body className="pt-0 mt-2">
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={validation.handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email}
                      isInvalid={
                        validation.touched.email && !!validation.errors.email
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password}
                        isInvalid={
                          validation.touched.password &&
                          !!validation.errors.password
                        }
                      />
                      <InputGroup.Text
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {validation.errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    id="rememberMe"
                    className="mb-3"
                  />

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending && (
                        <Spinner size="sm" className="me-2" />
                      )}{' '}
                      Log In
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} {FOOTER_TEXT}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default Login;
