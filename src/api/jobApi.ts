import API from "./axios";

export const getJobs = (params: any) =>
  API.get("/jobs", { params });

export const applyJob = (jobId: string) =>
  API.post(`/applications/${jobId}`);

export const createJob = (data: {
  title: string;
  company: string;
  skills: string[];
  location: string;
}) => API.post("/jobs", data);

export const deleteJob = (id: string) =>
  API.delete(`/jobs/${id}`);