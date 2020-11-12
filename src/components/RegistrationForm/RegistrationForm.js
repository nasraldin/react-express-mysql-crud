import "./RegistrationForm.css";

import { ACCESS_TOKEN_NAME, API_REGISTER } from "../../constants/apiConstants";
import React, { useState } from "react";

import axios from "axios";
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
  const [state, setState] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    successMessage: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const sendDetailsToServer = () => {
    if (state.email.length && state.password.length) {
      props.showError(null);

      const payload = {
        first_name: state.firstName,
        email: state.email,
        password: state.password,
      };

      axios
        .post(API_REGISTER, payload)
        .then(function (response) {
          if (response.status === 200) {
            setState((prevState) => ({
              ...prevState,
              successMessage:
                "Registration successful. Redirecting to home page..",
            }));
            localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
            redirectToHome();
            props.showError(null);
          } else {
            props.showError(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      props.showError("Please enter valid username and password");
    }
  };

  const redirectToHome = () => {
    props.updateTitle("Home");
    props.history.push("/home");
  };

  const redirectToLogin = () => {
    props.updateTitle("Login");
    props.history.push("/login");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password === state.confirmPassword) {
      sendDetailsToServer();
    } else {
      props.showError("Passwords do not match");
    }
  };

  return (
    <div>
      <form>
        <div className="form-label-group">
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Your Name"
            value={state.firstName}
            onChange={handleChange}
          />
          <label htmlFor="exampleInputEmail1">Name</label>
        </div>

        <div className="form-label-group">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={state.email}
            onChange={handleChange}
          />
          <label htmlFor="exampleInputEmail1">Email</label>
        </div>
        <div className="form-label-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
          <label htmlFor="exampleInputPassword1">Password</label>
        </div>
        <div className="form-label-group">
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={state.confirmPassword}
            onChange={handleChange}
          />
          <label htmlFor="exampleInputPassword1">Confirm Password</label>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-primary btn-block"
          onClick={handleSubmitClick}
        >
          Register
        </button>
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
      <div className="mt-2">
        <span>Already have an account? </span>
        <span className="loginText" onClick={() => redirectToLogin()}>
          Login here
        </span>
      </div>
    </div>
  );
}

export default withRouter(RegistrationForm);
