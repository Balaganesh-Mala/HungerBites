import api from "./axios";

export const getBlogsApi = async () => {
  return await api.get("/blogs");
};
