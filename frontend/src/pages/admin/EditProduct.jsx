import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminAxios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductForm from "../../components/admin/ProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });

  const loadProduct = async () => {
    try {
      const res = await adminApi.get(`/products/${id}`);
      setForm(res.data.product);
    } catch (err) {
      Swal.fire("Error", "Failed to load product", "error");
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApi.put(`/products/${id}`, form);
      Swal.fire("Updated!", "Product updated successfully", "success");
      navigate("/admin/products");
    } catch (err) {
      Swal.fire("Error", "Failed to update product", "error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

      <ProductForm
        form={form}
        setForm={setForm}
        submit={submit}
        loading={loading}
      />
    </div>
  );
};

export default EditProduct;
