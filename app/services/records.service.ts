import APIFETCH from "~/lib/axios/axiosConfig";

export const recordsService = {
  getAll: (params?: Record<string, string>) =>
    APIFETCH.get("/records/all", { params }).then((r) => r.data),
  getMyRecords: () => APIFETCH.get("/records/my-records").then((r) => r.data),
  deleteById: (id: number, documentType: string) =>
    APIFETCH.delete(`/records/delete/${id}`, { data: { documentType } }).then((r) => r.data),
};
