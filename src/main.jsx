import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { HashRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener(
    "wheel",
    function (e) {
      if (e.target.type === "number" && document.activeElement === e.target) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Disable arrow keys (up/down) on number inputs
  document.addEventListener("keydown", function (e) {
    if (e.target.type === "number" && document.activeElement === e.target) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    }
  });
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);
