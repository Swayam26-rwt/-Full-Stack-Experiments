// ============================================
// main.jsx
// This is the entry point of the React app.
// It takes our App component and "mounts" it
// (attaches it) to the HTML page.
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Find the <div id="root"></div> in index.html
// and render our App component inside it.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);