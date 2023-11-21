import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/navbar/Navigation";
import Posts from "./components/posts/PostsTable";
import Home from "./components/home/Posts";
import FullPost from "./components/home/FullPost";

const AppRouter = () => {
  return (
    <div className="app-router">
      <Router>
        <main>
          <Navigation />
          <Routes>
            <Route path="/" exact Component={Home}></Route>
            <Route path="/posts" exact Component={Posts}></Route>
            <Route path="/post/:id" Component={FullPost} />
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
