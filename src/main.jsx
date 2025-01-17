// core styles are required for all packages
import "@mantine/core/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { TagsProvider } from "./context/TagsProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <AuthProvider>
        <TagsProvider>
          <ModalsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ModalsProvider>
        </TagsProvider>
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);
