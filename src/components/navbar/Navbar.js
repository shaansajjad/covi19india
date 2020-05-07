import React from "react";
import "./Navbar.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="area"></div>
      <nav className="main-menu">
        <div className="maincovid">
          <a href="#">
            COVID19<span>INDIA</span>
          </a>
        </div>
        <ul className="main-menuul">
          <li>
            <Link to="/">
              <i className="fa fa-home fa-2x"></i>
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li className="has-subnav">
            <Link to="/demo">
              {/* <i className="fa fa-laptop fa-2x"></i> */}
              <i className="fa fa-user"></i>

              <span className="nav-text">Demographics</span>
            </Link>
          </li>
          <li className="has-subnav">
            <Link to="/deep">
              <i className="fa fa-list fa-2x"></i>
              <span className="nav-text">Deep Dive</span>
            </Link>
          </li>
          <li className="has-subnav">
            <a href="#">
              <i className="fa fa-cube "></i>
              {/* <i class="fas fa-cube"></i> */}

              <span className="nav-text">Essentials</span>
            </a>
          </li>
          <li>
            <Link to="/about">
              <i className="fa fa-question-circle"></i>
              {/* <i class="far fa-question-circle"></i> */}

              <span className="nav-text">FAQ</span>
            </Link>
          </li>
          <li>
            <h5 className="nav-h">A crowdsourced initiative.</h5>
          </li>
        </ul>
        <ul class="logout">
          <li>
            <a href="#">
              <i className="fa fa-moon"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
