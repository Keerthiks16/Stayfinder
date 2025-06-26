import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#333333",
            border: "2px solid transparent",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "16px 20px",
            fontSize: "14px",
            fontWeight: "500",
            position: "relative",
            overflow: "hidden",
          },
          success: {
            style: {
              background: "#ffffff",
              color: "#059669",
              border: "2px solid #10B981",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "-100%",
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, #3B82F6, #F97316)",
                animation: "borderSlide 3s linear forwards",
              },
            },
          },
          error: {
            style: {
              background: "#ffffff",
              color: "#DC2626",
              border: "2px solid #EF4444",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "-100%",
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, #F97316, #3B82F6)",
                animation: "borderSlide 3s linear forwards",
              },
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
