import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "سرور ایرر";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(
        new Error("نیٹ ورک کنکشن نہیں ہے۔ براہ کرم چیک کریں")
      );
    } else {
      // Something else happened
      return Promise.reject(new Error("نا معلوم ایرر"));
    }
  }
);

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Subcategories API
export const subcategoriesAPI = {
  getAll: () => api.get("/subcategories"),
  getByCategory: (categoryId) =>
    api.get(`/subcategories/category/${categoryId}`),
  create: (data) => api.post("/subcategories", data),
  update: (id, data) => api.put(`/subcategories/${id}`, data),
  delete: (id) => api.delete(`/subcategories/${id}`),
};

// Brands API
export const brandsAPI = {
  getAll: () => api.get("/brands"),
  create: (data) => api.post("/brands", data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get("/orders", { params }),
  getToday: () => api.get("/orders/today"),
  getById: (id) => api.get(`/orders/${id}`),
  getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
  create: (data) => api.post("/orders", data),
};

export default api;
