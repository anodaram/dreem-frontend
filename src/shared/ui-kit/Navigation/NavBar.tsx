import React from "react";
import ScrollToTop from "../../functions/ScrollToTop";
import Routes from "shared/routes/Routes";
import { useLogin } from "shared/hooks/useLogin";
import "./NavBar.css";

const NavBar = () => {
  const isLogin = useLogin();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ScrollToTop />
        <div id="app-container" className="containerClassnames">
          <div className="fullPageView">
            <main className={isLogin ? "fullPageView-main" : ""}>
              <div className="container-fluid">
                <Routes />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
