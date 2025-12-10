import api from "./axios";

export const submitContactMessageApi = (data) => {
  return api.post("/contact/submit", data);
};
