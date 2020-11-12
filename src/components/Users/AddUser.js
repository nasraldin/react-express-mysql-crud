import { API_USERS, AUTHORIZATION } from "../../constants/apiConstants";
import React, { useState } from "react";

import axios from "axios";
import { withRouter } from "react-router-dom";

function AddUser(props) {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    errors: {},
    successMessage: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const { role } = e.target.value;

    setState((prevState) => ({
      ...prevState,
      [id]: value,
      [role]: role,
    }));
  };

  const sendDetailsToServer = () => {
    if (state.email.length && state.password.length) {
      props.showError(null);

      const payload = {
        first_name: state.firstName,
        last_name: state.lastName,
        email: state.email,
        password: state.password,
        role: state.role,
      };

      axios
        .post(API_USERS, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: AUTHORIZATION,
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setState((prevState) => ({
              ...prevState,
              successMessage:
                "Add user successful. Redirecting to users page..",
            }));

            redirectToUsers();
            props.showError(null);
          } else {
            props.showError(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      props.showError("Please enter valid email and password");
    }
  };

  const redirectToUsers = () => {
    props.updateTitle("Users");
    props.history.push("/users");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.password && state.email) {
      sendDetailsToServer();
    } else {
      props.showError("Error");
    }
  };

  return (
    <div className="mt-2">
      <form>
        <div className="form-group mb-3">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First Name"
            value={state.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Last Name"
            value={state.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="User Password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="role">User Role</label>
          <select
            id="role"
            className="form-control custom-select"
            defaultValue={state.selectValue}
            onChange={handleChange}
          >
            <option defaultValue value="user">
              User
            </option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Add New User
        </button>
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
    </div>
  );
}

export default withRouter(AddUser);
