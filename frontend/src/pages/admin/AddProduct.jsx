import React, { useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApi.post("/products", form);
      Swal.fire("Success", "Product added successfully", "success");
      navigate("/admin/products");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Product</h1>

      <ProductForm
        form={form}
        setForm={setForm}
        submit={submit}
        loading={loading}
      />
    </div>
  );
};

export default AddProduct;
