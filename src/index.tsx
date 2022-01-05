import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

const loader = document.querySelector(".loader");

const hideLoader = () => loader?.classList.add("loader--hide");

setTimeout(
  () =>
    ReactDOM.render(
      <React.StrictMode>
        <App hideLoader={hideLoader} />
      </React.StrictMode>,
      document.getElementById("root")
    ),
  1000
);
