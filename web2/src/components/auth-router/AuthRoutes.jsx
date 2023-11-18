import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "../login/ErrorPage";
import Login from "../login/Login";
import Signup from "../login/Signup";

const AuthRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/*",
      element: <Navigate to={"/"} />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default AuthRoutes;
