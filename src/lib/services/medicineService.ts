import http from "@oursrc/lib/http";

import { CreateMedicineRequest, UpdateMedicineRequest } from "../models/medicine";
import { ResponseObjectList } from "../models/response-object";

const endpoint = "api/medicines";

export const medicineService = {
  getMedicine: (page: number, pageSize: number = 30) =>
    http.get<ResponseObjectList<any>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getMedicineById: (id: string) =>
    http.get(endpoint + `/${id}`),
  createMedicine: (model: CreateMedicineRequest) =>
    http.post(endpoint, {
      unit: model.unit,
      name: model.name,
      mainIngredient: model.mainIngredient,
      registerNumber: model.registerNumber,
      netWeight: model.netWeight,
      usage: model.usage,
    }),
  updateMedicine: (id: string, model: UpdateMedicineRequest) =>
    http.put(endpoint + `/${id}`, {
      unit: model.unit,
      name: model.name,
      mainIngredient: model.mainIngredient,
      registerNumber: model.registerNumber,
      netWeight: model.netWeight,
      usage: model.usage,
    }),
  deleteMedicine: (id: string) => http.delete(endpoint + `/${id}`),
};
