import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// React Router Dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import { Flowbite } from "flowbite-react";
import App from "./App.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import { signOut } from "firebase/auth";
import auth from "./firebase/config.js";
import { toast } from "react-toastify";

// Routes
import Home from "./routes/Home.jsx";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/Signup.jsx";
import Queries from "./routes/Queries.jsx";
import QueryDetails from "./routes/QueryDetails.jsx";
import MyRecommendations from "./routes/MyRecommendations.jsx";
import MyQueries from "./routes/MyQueries.jsx";
import RecommendationsForMe from "./routes/RecommendationsForMe.jsx";
import EditQuery from "./routes/EditQuery.jsx";
import NotFound from "./routes/NotFound.jsx";
import UpdateProfile from "./routes/UpdateProfile.jsx";

// Logout User
const logoutUser = async () => {
  try {
    signOut(auth);
    await fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
      credentials: "include",
    });
    toast.info("Please Login First!");
  } catch (error) {
    console.error(error);
  }
};

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => [
          await (
            await fetch(`${import.meta.env.VITE_SERVER_URL}/queries?limit=6`)
          ).json(),
          await (
            await fetch(
              `${import.meta.env.VITE_SERVER_URL}/tips-n-guides?limit=4`
            )
          ).json(),
        ],
      },
      {
        path: "/login",
        element: (
          <PrivateRoute reverse>
            <Login />
          </PrivateRoute>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <PrivateRoute reverse>
            <SignUp />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-profile",
        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/queries",
        element: <Queries />,
        loader: async () => [
          await (
            await fetch(`${import.meta.env.VITE_SERVER_URL}/queries?limit=9`)
          ).json(),
          await (
            await fetch(`${import.meta.env.VITE_SERVER_URL}/queries/count`)
          ).json(),
        ],
      },
      {
        path: "/query-details/:queryId",
        element: <QueryDetails />,
        loader: async ({ params }) => [
          await (
            await fetch(
              `${import.meta.env.VITE_SERVER_URL}/queries/${params.queryId}`
            )
          ).json(),
          await (
            await fetch(
              `${import.meta.env.VITE_SERVER_URL}/recommendations?queryId=${
                params.queryId
              }`
            )
          ).json(),
        ],
      },
      {
        path: "/me/recommendations-for-me",
        element: (
          <PrivateRoute>
            <RecommendationsForMe />
          </PrivateRoute>
        ),
        loader: async () => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/me/recommendations/for-me`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            return data.result;
          } else {
            await logoutUser();
            return null;
          }
        },
      },
      {
        path: "/me/queries",
        element: (
          <PrivateRoute>
            <MyQueries />
          </PrivateRoute>
        ),
        loader: async () => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/me/queries`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            return data.result;
          } else {
            await logoutUser();
            return null;
          }
        },
      },
      {
        path: "/me/recommendations",
        element: (
          <PrivateRoute>
            <MyRecommendations />
          </PrivateRoute>
        ),
        loader: async () => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/me/recommendations`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            return data.result;
          } else {
            await logoutUser();
            return null;
          }
        },
      },
      {
        path: "/create-query",
        element: (
          <PrivateRoute>
            <EditQuery />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-query/:queryId",
        element: (
          <PrivateRoute>
            <EditQuery />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/queries/${params.queryId}`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          if (res.status === 200 || res.status === 404 || res.status === 400) {
            return data;
          } else {
            await logoutUser();
            return null;
          }
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Flowbite>
      <RouterProvider router={router} />
    </Flowbite>
  </React.StrictMode>
);