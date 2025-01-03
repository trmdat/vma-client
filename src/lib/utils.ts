import { UseFormSetError, set } from "react-hook-form";
import { EntityError } from "./http";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateValue } from "@nextui-org/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((error: any) => {
      setError(error.field, { type: "server", message: error.message });
    });
  } else {
    console.log(error);
  }
};

export const decodeToken = (token: string) => {
  if (!token) {
    return;
  }
  return JSON.parse(atob(token.split(".")[1]));
};

export const changeToDate = (date: DateValue) => {
  return new Date(date.year, date.month - 1, date.day);
};

export const dateTimeConverter = (dateTimeString: string): string => {
  if (!dateTimeString) {
    return "";
  }
  const date = new Date(dateTimeString);
  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-based in JavaScript
  const day = ("0" + date.getUTCDate()).slice(-2);
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);

  if (hours === "00" && minutes === "00" && seconds === "00") {
    return `${day}-${month}-${year}`;
  } else {
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}

export const dateConverter = (date: string): string => {
  if (!date) {
    return "";
  }
  const dateObj = new Date(date.split("T")[0]);
  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);

  return `${day}-${month}-${year}`;
};

export const parseToWeekday = (date: string): string => {
  if (!date) {
    return "";
  }
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString("vi-VN", { weekday: "long" });

  return weekday;
};

export const eliminateTime = (date: string): string => {
  if (!date) {
    return "";
  }
  const dateObj = new Date(date)
  // minus 7 hours to get the correct date
  dateObj.setHours(dateObj.getHours() - 7);
  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export const eliminateDate = (date: string): string => {
  if (!date) {
    return "";
  }
  const dateObj = new Date(date);
  const hours = ("0" + dateObj.getHours()).slice(-2);
  const minutes = ("0" + dateObj.getMinutes()).slice(-2);
  const seconds = ("0" + dateObj.getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

export const dateArrayConverter = (dates: string[]): string[] => {
  return dates.map((date) => eliminateTime(date));
};

export const ROLE = {
  VETERINARIAN: "veterinarian",
  FARMER: "farmer",
  FARMERASSISTANT: "farmerassistant",
  ADMIN: "admin",
};
