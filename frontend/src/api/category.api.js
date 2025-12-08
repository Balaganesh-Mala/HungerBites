
import userApi from "./axios";

// 👉 User: Get all categories
const categoryApi = () => userApi.get("/categories");
export default categoryApi;

// 👉 Admin: Get all categories
export const getAllCategoriesApi = () => adminApi.get("/categories");


