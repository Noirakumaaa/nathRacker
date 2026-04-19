import APIFETCH from "~/lib/axios/axiosConfig";
import type { BusFormFields } from "~/types/busTypes";

export const busService = {
  getAll: () => APIFETCH.get("/bus/all").then((r) => r.data),
  getById: (id: number) => APIFETCH.get(`/bus/records/${id}`).then((r) => r.data),
  create: (data: BusFormFields) => APIFETCH.post("/bus/encode", data).then((r) => r.data),
  update: (data: BusFormFields) => APIFETCH.patch("/bus/update", data).then((r) => r.data),
  delete: (id: number) => APIFETCH.delete(`/bus/delete/${id}`).then((r) => r.data),
};
