import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// MSW is optional in the browser build. The app renders even if the
// Service Worker has not been generated yet; eventService has a local
// fallback so the experiment can be run immediately after extracting.
async function startBrowserMocking() {
  if (!import.meta.env.DEV) return;

  try {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    console.log("[MSW] Browser mock API enabled.");
  } catch (error) {
    console.warn(
      "[MSW] Browser worker unavailable. Using the built-in local API fallback.",
      error
    );
  }
}

// Do not block React rendering while MSW starts.
startBrowserMocking();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
