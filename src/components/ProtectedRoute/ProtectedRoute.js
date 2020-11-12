import {
  ACCESS_TOKEN_NAME,
  API_CHECK_AUTH,
} from "../../constants/apiConstants";
import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      axios({
        method: "GET",
        url: API_CHECK_AUTH,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_NAME)}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false }, () => {});
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch((err) => {
          localStorage.removeItem(ACCESS_TOKEN_NAME);
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/" />;
      }
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  };
}
