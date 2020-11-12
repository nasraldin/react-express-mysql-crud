import { ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import React from "react";
import { withRouter } from "react-router-dom";
function Header(props) {
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  let title = capitalize(
    props.location.pathname.substring(1, props.location.pathname.length)
  );

  if (props.location.pathname === "/") {
    title = "Home";
  }

  function renderLogout() {
    if (localStorage.getItem(ACCESS_TOKEN_NAME)) {
      return (
        <li className="nav-item">
          <button className="btn-unset nav-link" onClick={() => handleLogout()}>
            Logout
          </button>
        </li>
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    props.history.push("/login");
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          User CURD | {title}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExampleDefault"
          aria-controls="navbarsExampleDefault"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto mb-2 mb-md-0">
            <li className="nav-item active">
              <a className="nav-link" aria-current="page" href="/home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/users">
                Users
              </a>
            </li>
            {renderLogout()}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default withRouter(Header);
