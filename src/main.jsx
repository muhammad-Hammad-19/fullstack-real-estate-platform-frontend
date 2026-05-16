import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PostContextProvider>
  </StrictMode>,
);
