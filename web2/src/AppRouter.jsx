import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/navbar/Navigation";
import Home from "./components/home/Home";
import Admin from "./components/admin/Admin";
import Posts from "./components/posts/Posts";

const AppRouter = () => {
  return (
    <div className="app-router">
      <Router>
        <main>
          <Navigation />
          <Routes>
            <Route path="/" exact Component={Home}></Route>
            <Route path="/posts" exact Component={Posts}></Route>
            <Route path="/admin" exact Component={Admin}></Route>
            <Route path="/*" Component={Home}>
              {" "}
            </Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default AppRouter;
