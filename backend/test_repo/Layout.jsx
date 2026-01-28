import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer /> 
    </div>
  );
};

export default Layout;
