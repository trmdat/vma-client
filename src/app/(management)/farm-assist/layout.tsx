import React from "react";
import { GiCage, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import Footer from "@oursrc/app/(management)/footer";
import CustomNavbar, { NavbarItem } from "@oursrc/components/custom-navbar";
import CustomHeader from "@oursrc/components/custom-header";

const FarmerAssistantLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const projectName = "VMA";
  const titleMap: { [key: string]: string } = {
    "/dashboard": projectName + " - " + "Tổng quan",
    "/herd": projectName + " - " + "Quản lý đàn heo",
    "/herd/create": projectName + " - " + "Tạo đàn mới",
    "/medicine": projectName + " - " + "Quản lý thuốc",
    "/medicine/new-batch": projectName + " - " + "Tạo lô mới",
    "/vaccination": projectName + " - " + "Lịch tiêm phòng",
    "/treatment": projectName + " - " + "Kế hoạch điều trị",
    "/cage": projectName + " - " + "Quản lý chuồng",
    "/alert": projectName + " - " + "Cảnh báo",
  };
  const navbarItems: NavbarItem[] = [
    {
      path: "/dashboard",
      title: "Tổng quan",
      icon: <MdSpaceDashboard size={25} />,
    },
    {
      path: "/herd",
      title: "Quản lý đàn heo",
      icon: <GiPig size={25} />,
    },
    {
      path: "/medicine",
      title: "Quản lý thuốc",
      icon: <GiMedicines size={25} />,
    },
    {
      path: "/vaccination",
      title: "Lịch tiêm phòng",
      icon: <TbVaccine size={25} />,
    },
    {
      path: "/treatment",
      title: "Kế hoạch điều trị",
      icon: <BsFillCalendarHeartFill size={25} />,
    },
    {
      path: "/cage",
      title: "Quản lý chuồng",
      icon: <GiCage size={25} />,
    },
    {
      path: "/alert",
      title: "Cảnh báo",
      icon: <HiBellAlert size={25} />,
    },
  ];
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-grow">
        <div className="ml-4 my-4">
          <CustomNavbar prefix="/farm-assist" navbarItems={navbarItems} />
        </div>
        <div className="ml-4 flex-grow">
          <div className="p-2">
            <CustomHeader titleMap={titleMap} prefix="/farm-assist" />
          </div>
          <div className="ml-2 mr-3 h-fit">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerAssistantLayout;