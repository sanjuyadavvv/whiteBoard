import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Store } from "./Components/app/Store.js";

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientID = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientID}>
    <Provider store={Store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
