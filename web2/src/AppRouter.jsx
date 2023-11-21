import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/navbar/Navigation";
import Admin from "./components/admin/Admin";
import Posts from "./components/posts/Posts";
import FullPost from "./components/posts/FullPost";

const AppRouter = () => {
  return (
    <div className="app-router">
      <Router>
        <main>
          <Navigation />
          <Routes>
            <Route path="/" exact Component={Posts}></Route>
            <Route path="/admin" exact Component={Admin}></Route>
            <Route path="/post/:id" Component={FullPost} />
            <Route path="/*" Component={Posts}>
              {" "}
            </Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default AppRouter;
