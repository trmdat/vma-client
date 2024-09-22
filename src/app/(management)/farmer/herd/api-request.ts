import http from "@oursrc/lib/http";
import { CreateHerdRequest } from "./models/herd";

export const apiRequest = {
  createHerd: (model: CreateHerdRequest) =>
    http.post("api/herds", {
      breed: model.breed,
      totalNumber: model.totalNumber,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate
    }),
};
