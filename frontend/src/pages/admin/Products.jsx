import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaDownload } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    mrp: "",
    stock: "",
    flavor: "",
    weight: "",
    brand: "",
    category: "",
    description: "",
    isFeatured: false,
    isBestSeller: false,
    image: null,
  });

  // Fetch products
  const loadProducts = async () => {
    const res = await adminApi.get("/products");
    setProducts(res.data.products);
  };

  // Fetch categories
  const loadCategories = async () => {
    const res = await adminApi.get("/categories");
    setCategories(res.data.categories);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Form Change Handler
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === "checkbox") value = checked;
    if (name === "image") value = e.target.files[0];

    setForm({ ...form, [name]: value });
  };

  // OPEN CREATE PRODUCT MODAL
  const openCreateModal = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setForm({
      name: "",
      price: "",
      mrp: "",
      stock: "",
      flavor: "",
      weight: "",
      brand: "Hunger Bites",
      category: "",
      description: "",
      isFeatured: false,
      isBestSeller: false,
      image: null,
    });
    setModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (product) => {
    setEditMode(true);
    setSelectedProduct(product);

    setForm({
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      flavor: product.flavor,
      weight: product.weight,
      brand: product.brand,
      category: product.category?._id,
      description: product.description,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      image: null,
    });

    setModalOpen(true);
  };

  // CREATE / UPDATE PRODUCT
  const submitForm = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) fd.append(key, form[key]);
    });

    try {
      if (editMode) {
        await adminApi.put(
          `/products/${selectedProduct._id}`,
          fd
        );
        Swal.fire("Success", "Product Updated", "success");
      } else {
        await adminApi.post("/products", fd);
        Swal.fire("Success", "Product Created", "success");
      }

      setModalOpen(false);
      loadProducts();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await adminApi.delete(`/products/${id}`);
        Swal.fire("Deleted!", "Product removed", "success");
        loadProducts();
      }
    });
  };

  // 🚀 EXPORT PRODUCTS TO EXCEL
  const exportExcel = async () => {
    const res = await adminApi.get("/admin/export-products", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.xlsx";
    a.click();
  };

  // 🚀 EXPORT PDF
  const exportPDF = async () => {
    const res = await adminApi.get("/admin/export-products-pdf", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.pdf";
    a.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id}>{c.name}</option>
          ))}
        </select>

        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
          <FaDownload /> Excel
        </button>

        <button onClick={exportPDF} className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
          <FaDownload /> PDF
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Bestseller</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .filter((p) =>
                categoryFilter ? p.category?.name === categoryFilter : true
              )
              .map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">
                    <img
                      src={p.images?.[0]?.url}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name}</td>
                  <td>{p.isFeatured ? "Yes" : "No"}</td>
                  <td>{p.isBestSeller ? "Yes" : "No"}</td>

                  <td className="flex gap-2 justify-center p-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={submitForm} className="space-y-3">
              <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="border w-full p-2 rounded" required />

              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="mrp" placeholder="MRP" value={form.mrp} onChange={handleChange} className="border p-2 rounded" />
              </div>

              <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="border w-full p-2 rounded" />

              <input type="text" name="flavor" placeholder="Flavor" value={form.flavor} onChange={handleChange} className="border w-full p-2 rounded" />

              <input type="text" name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} className="border w-full p-2 rounded" />

              <select name="category" value={form.category} onChange={handleChange} className="border w-full p-2 rounded">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <textarea name="description" value={form.description} onChange={handleChange} className="border w-full p-2 rounded" placeholder="Description"></textarea>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                Featured
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
                Best Seller
              </label>

              <input type="file" name="image" accept="image/*" onChange={handleChange} className="border w-full p-2 rounded" />

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
