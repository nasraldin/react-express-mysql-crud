import "./App.css";

import React, { useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import LoginForm from "./components/LoginForm/LoginForm";
import PrivateRoute from "./utils/PrivateRoute";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";

function App() {
  const [title, updateTitle] = useState(null);
  const [updateErrorMessage] = useState(null);
  return (
    <Router>
      <div className="App">
        <Header title={title} />
        <main className="flex-shrink-0">
          <div className="container">
            <Switch>
              <Route path="/register">
                <RegistrationForm
                  showError={updateErrorMessage}
                  updateTitle={updateTitle}
                />
              </Route>
              <Route path="/login">
                <LoginForm
                  showError={updateErrorMessage}
                  updateTitle={updateTitle}
                />
              </Route>
              <PrivateRoute path="/home">
                <Home />
              </PrivateRoute>
            </Switch>
          </div>
        </main>

        <footer className="footer mt-auto py-3 bg-light">
          <div className="container text-center">
            <span className="text-muted">
              <a href="https://nasraldin.com">Nasr Aldin</a> 2020
            </span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
