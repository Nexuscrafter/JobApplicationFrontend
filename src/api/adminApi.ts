import API from "./axios";

export const getApplications = () =>
  API.get("/admin/applications");

export const updateStatus = (id: string, status: string) =>
  API.put(`/admin/applications/${id}`, { status });