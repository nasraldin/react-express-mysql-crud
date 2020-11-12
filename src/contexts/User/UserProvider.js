import {
  ACCESS_TOKEN_NAME,
  API_CHECK_AUTH,
  API_LOGIN,
} from "../../constants/apiConstants";
import React, { Component } from "react";

import UserContext from "./UserContext";
import axios from "axios";
import { withRouter } from "react-router-dom";

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      name: null,
    };
  }

  componentDidMount() {
    if (localStorage.getItem(ACCESS_TOKEN_NAME)) {
      axios({
        method: "GET",
        url: API_CHECK_AUTH,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_NAME)}`,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              isLoggedIn: true,
              name: response.data.result,
            });
          } else {
            alert(response.data.message);
            this.props.history.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          name: this.state.name,
          handleLogin: (data) => {
            axios({
              method: "POST",
              url: API_LOGIN,
              data: data,
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            })
              .then((response) => {
                if (response.status === 200) {
                  this.setState(
                    {
                      isLoggedIn: true,
                    },
                    () => {
                      this.props.history.push("/home");
                    }
                  );
                } else {
                  alert(response.data.message);
                }
              })
              .catch((error) => {
                // return;
                alert(error.data && error.data.message);
              });
          },
          handleLogout: (data) => {
            localStorage.removeItem(ACCESS_TOKEN_NAME);
            this.props.history.push("/");
          },
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default withRouter(UserProvider);
