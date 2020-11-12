import "./LoginForm.css";

import { ACCESS_TOKEN_NAME, API_LOGIN } from "../../constants/apiConstants";
import React, { useState } from "react";

import axios from "axios";
import { withRouter } from "react-router-dom";

function LoginForm(props) {
  const [state, setState] = useState({
    email: "",
    password: "",
    successMessage: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();

    const payload = {
      email: state.email,
      password: state.password,
    };

    axios
      .post(API_LOGIN, payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            successMessage: "Login successful. Redirecting to home page..",
          }));
          localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
          redirectToHome();
          props.showError(null);
        } else if (response.code === 204) {
          props.showError("Username and password do not match");
        } else {
          props.showError("Username does not exists");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const redirectToHome = () => {
    props.updateTitle("Users");
    props.history.push("/users");
  };

  const redirectToRegister = () => {
    props.updateTitle("Register");
    props.history.push("/register");
  };

  return (
    <div>
      <form>
        <div className="form-label-group">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={state.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email address</label>
        </div>

        <div className="form-label-group">
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <input
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          value="Login"
          onClick={handleSubmitClick}
        />
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
      <div className="registerMessage mt-3">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>
          Register
        </span>
      </div>
    </div>
  );
}

export default withRouter(LoginForm);
