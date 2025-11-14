import adminApi from "./adminAxios";

export const getAllCategoriesApi = () => adminApi.get("/categories");

export const createCategoryApi = (data) =>
  adminApi.post("/categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategoryApi = (id, data) =>
  adminApi.put(`/categories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCategoryApi = (id) =>
  adminApi.delete(`/categories/${id}`);
