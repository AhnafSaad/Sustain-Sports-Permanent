import "./index.css";
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';// We will render the App component directly, 
// since it already contains the Router and all the necessary Providers.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
