import { Outlet, Link, useRoutes, useParams } from "react-router-dom";
import Footer from "./components/footer";
import BikesListing from "./modules/BikesListing";
import Home from "./modules/Home";
import ManagersDashboard from "./modules/ManagersDashboard";
import MyAccount from "./modules/MyAccount";
import ReserveBike from "./modules/Reserve";

const routes = [
  {
    path: "/",
    element: <Home />,
    // children: [
    //   { index: true, element: <Home /> },
    //   {
    //     path: "/courses",
    //     element: <Courses />,
    //     children: [
    //       { index: true, element: <CoursesIndex /> },
    //       { path: "/courses/:id", element: <Course /> },
    //     ],
    //   },
    //   { path: "*", element: <NoMatch /> },
    // ],
  },
  { path: "/bikes", element: <BikesListing />},
  { path: "/reserve", element: <ReserveBike />},
  { path: "/my-account", element: <MyAccount />},
  { path: "/managers/dashboard", element: <ManagersDashboard />}
];

export {routes};

