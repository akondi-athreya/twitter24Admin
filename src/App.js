import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./layouts/Main";
import NotFound from "./pages/NotFound";
import Signin from "./pages/newSignin";

import publicRoutes from "./routes/PublicRoutes";
import protectedRoutes from "./routes/ProtectedRoutes";

import { normalProtectedRoutes, baseProtectedRoutes, premiumProtectedRoutes } from "./routes/ProtectedRoutes";

import '@fortawesome/fontawesome-free/css/all.min.css';
// import css
import "./assets/css/remixicon.css";

import NewHome from "./docs/NewHome";

// import scss
import "./scss/style.scss";
import { UserProvider, useUser } from "./userContext";

// set skin on load
window.addEventListener("load", function () {
  let skinMode = localStorage.getItem("skin-mode");
  let HTMLTag = document.querySelector("html");

  if (skinMode) {
    HTMLTag.setAttribute("data-skin", skinMode);
  }
});



const AppRoutes = () => {
  const { isLogin } = useUser();
  const userplan = JSON.parse(localStorage.getItem("twitter24userPlan"))
  const isemployee = JSON.parse(localStorage.getItem("userIsEmployee"));
  let main_user_plan = userplan ? userplan[0]?.plan : '';
  // console.log(isemployee)
  let main_routes;
  if (isemployee?.success === true) {
    main_routes = protectedRoutes;
    main_routes.push({ path: "admin", element: <NewHome /> });
    console.log(main_routes)
    console.log(window.location.pathname)
  }
  else if (main_user_plan === 'none' && isemployee?.success === false) {
    main_routes = normalProtectedRoutes;
  }
  else if (main_user_plan === 'Base') {
    main_routes = baseProtectedRoutes;
  }
  else if (main_user_plan === 'Premium' || main_user_plan === "Premium Pro") {
    main_routes = premiumProtectedRoutes;
  }
  else {
    main_routes = protectedRoutes;
  }


  return (
    <Routes>
      {isLogin && main_routes ? (
        <Route path="/" element={<Main />}>
          <Route index element={<NewHome />} />
          {main_routes?.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
        </Route>
      ) : (
        <Route path="*" element={<Signin />} />
      )}
      {publicRoutes.map((route, index) => (
        <Route path={route.path} element={route.element} key={index} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <React.Fragment>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </React.Fragment>
  );
}