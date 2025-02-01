/*
Auto-generated code from Convex with Clerk documentation. 
Publishable key acquired from Clerk Dashboard and does not need to be kept secret. 
Convex URL is the URL of the Convex server.
Documentation : https://docs.convex.dev/auth/clerk
*/

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_dGlnaHQtcmF2ZW4tNDIuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
