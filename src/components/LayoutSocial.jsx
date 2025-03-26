import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isFixed={true} />

      <main className="flex-2">{children}</main>
    </div>
  );
};

export default Layout;
