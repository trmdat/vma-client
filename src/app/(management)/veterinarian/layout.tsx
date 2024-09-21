import React from "react";
import Footer from "@oursrc/app/(management)/footer";
import VetNavbar from "./(navbar)/navbar";
import VetHeader from "./header";

const VetLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-grow">
        <div className="ml-4 my-4">
          <VetNavbar />
        </div>
        <div className="ml-4 flex-grow">
          <div className="p-2">
            <VetHeader />
          </div>
          <div className="ml-2 mr-3 h-fit">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VetLayout;