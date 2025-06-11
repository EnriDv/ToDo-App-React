import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
]);