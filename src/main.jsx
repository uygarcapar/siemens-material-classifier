import React from "react";
import ReactDOM from "react-dom/client";
import { IxApplicationContext } from "@siemens/ix-react";
import App from "./App";

import "@siemens/ix/dist/siemens-ix/siemens-ix.css";
import "./i18n/i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IxApplicationContext>
      <App />
    </IxApplicationContext>
  </React.StrictMode>
);
