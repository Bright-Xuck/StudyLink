"use client";

import React, { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";
import Info from "../Info/Info";
import Footer from "../Footer/Footer";
import { LayoutStyles } from "@/styles/LayoutStyles/Layout";
import { useAppState } from "@/context/AppContext";

export interface ILayout {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    const { isNavOpen } = useAppState();
  return (
    <LayoutStyles $isNavOpen={isNavOpen}>
      <Header />
      <Info />
      <main>
        {children}    
      </main>
      <Footer />
    </LayoutStyles>
  );
};

export default Layout;

