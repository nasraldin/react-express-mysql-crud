import {
  ACCESS_TOKEN_NAME,
  API_CHECK_AUTH,
} from "../../constants/apiConstants";
import React, { useEffect } from "react";

import axios from "axios";
import { withRouter } from "react-router-dom";

function Home(props) {
  useEffect(() => {
    axios
      .get(API_CHECK_AUTH, {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then(function (response) {
        if (response.status !== 200) {
          redirectToLogin();
        }
      })
      .catch(function (error) {
        redirectToLogin();
      });
  });
  function redirectToLogin() {
    props.history.push("/login");
  }
  return <div className="mt-2">Home page content</div>;
}

export default withRouter(Home);
