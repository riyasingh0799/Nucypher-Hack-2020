import React, { Component } from "react";
import { Route, Switch, Router } from "react-router";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import HomePage from "./HomePage";
import QueriesPage from "./QueriesPage";

// const styles = {
//   logo: {
//     marginTop: '20px',
//     paddingLeft: '10px',
//     width: '200px'
//   },
//   navbar: {
//     marginTop: '5px'
//   }
// };

class Navbar extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/queries">
            <QueriesPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Navbar;
