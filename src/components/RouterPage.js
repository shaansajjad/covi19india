import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Home from "./home/Home";
import Header from "./header/Header";
import Deepdive from "./deepdive/Deepdive";
import Faq from "./faq/Faq";

export default function RouteLink() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/demo">
            <DemoGraphicPage />
          </Route>
          <Route path="/deep">
            <DeepDivePage />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

function HomePage() {
  return (
    <div className="home">
      <Navbar />
      <Home />
    </div>
  );
}
function DemoGraphicPage() {
  return (
    <div className="demographic">
      <Navbar />
      <Header />
    </div>
  );
}
function DeepDivePage() {
  return (
    <div className="deep-dive">
      <Navbar />
      <Deepdive />
    </div>
  );
}

function About() {
  return (
    <div className="about">
      <Navbar />
      <Faq />
    </div>
  );
}
