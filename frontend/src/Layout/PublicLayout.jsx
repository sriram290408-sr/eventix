import React from "react";
import { Outlet } from "react-router-dom";
import SignNav from "../components/SignNav";

function PublicLayout() {
  return (
    <div>
      <SignNav />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
