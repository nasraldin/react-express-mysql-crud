import { API_USERS, AUTHORIZATION } from "../../constants/apiConstants";
import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";

import Axios from "axios";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import UserContext from "../../contexts/User/UserContext";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await Axios({
        method: "GET",
        url: API_USERS,
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTHORIZATION,
        },
      });
      this.setState({
        users: response.data,
      });
    } catch (e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <>
        <UserContext.Consumer>
          {() => (
            <div className="mt-2">
              <Link
                to={{
                  pathname: `/users/add`,
                  state: {},
                }}
              >
                <button type="button" className="btn btn-dark mb-3">
                  Add New User
                </button>
              </Link>
              <table className="table table-responsive table-bordered table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.users.length > 0 ? (
                    this.state.users.map((user, index) => {
                      return (
                        <tr key={index}>
                          <td>{user.id}</td>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </UserContext.Consumer>
      </>
    );
  }
}

export default withRouter(ProtectedRoute(Users));
