// Navigation
import Navigator from "./component/Navigator";

//Context
import { AuthProvider } from "./contexts/AuthContext";
import React from "react";

export default function App() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}
