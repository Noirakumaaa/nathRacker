import APIFETCH from "~/lib/axios/axiosConfig";
import type { SwdiFormFields } from "~/types/swdiTypes";

export const swdiService = {
  getAll: () => APIFETCH.get("/swdi/all").then((r) => r.data),
  getById: (id: number) => APIFETCH.get(`/swdi/record/${id}`).then((r) => r.data),
  create: (data: SwdiFormFields) => APIFETCH.post("/swdi/encode", data).then((r) => r.data),
  update: (data: SwdiFormFields) => APIFETCH.patch("/swdi/update", data).then((r) => r.data),
  delete: (id: number) => APIFETCH.delete(`/swdi/delete/${id}`).then((r) => r.data),
};
