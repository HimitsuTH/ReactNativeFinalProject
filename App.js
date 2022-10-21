// Navigation
import Routes from "./component/Routes";

//Context
import { AuthProvider } from "./contexts/AuthContext";
import React from "react";

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
