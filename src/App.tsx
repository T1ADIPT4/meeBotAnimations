import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppLoader from "./components/AppLoader";
import Home from "./pages/Home";
import ContributorProfile from "./pages/ContributorProfile";
import Tools from "./pages/Tools";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
// import MeeBotSocketListener from "./components/MeeBotSocketListener";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) return <AppLoader onFinish={() => setLoaded(true)} />;

  return (
    <>
      {/* <MeeBotSocketListener /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<ContributorProfile />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
