import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCloudUploadAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
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
  });

  const [page, setPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await adminApi.get("/products");
    const reversed = [...res.data.products].reverse();
    setProducts(reversed);
    setFiltered(reversed);
  };

  const loadCategories = async () => {
    const res = await adminApi.get("/categories");
    setCategories(res.data.categories);
  };

  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((p) => p.category?.name === categoryFilter);
    }

    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      data = data.filter((p) => new Date(p.createdAt) >= sd);
    }

    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      data = data.filter((p) => new Date(p.createdAt) <= ed);
    }

    setFiltered(data);
    setPage(1);
  }, [search, categoryFilter, startDate, endDate, products]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") value = checked;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      Swal.fire("Limit Reached", "Max 6 images allowed", "warning");
      return;
    }
    files.forEach((file) =>
      setImages((prev) => [
        ...prev,
        { file, preview: URL.createObjectURL(file) },
      ])
    );
  };

  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setImages([]);
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
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditMode(true);
    setSelectedProduct(p);
    setImages(
      p.images?.map((i) => ({
        preview: i.url,
        file: null,
      })) || []
    );
    setForm({
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      flavor: p.flavor,
      weight: p.weight,
      brand: p.brand,
      category: p.category?._id,
      description: p.description,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
    });
    setModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      images.forEach((i) => i.file && fd.append("images", i.file));

      editMode
        ? await adminApi.put(`/products/${selectedProduct._id}`, fd)
        : await adminApi.post("/products", fd);

      Swal.fire("Success", editMode ? "Updated" : "Created", "success");
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
    }).then(async (p) => {
      if (p.isConfirmed) {
        await adminApi.delete(`/products/${id}`);
        Swal.fire("Deleted", "", "success");
        loadProducts();
      }
    });
  };

  const exportExcel = () => {
    const formatted = filtered.map((p) => ({
      "Created At": new Date(p.createdAt).toLocaleString(),
      Name: p.name,
      Price: p.price,
      Stock: p.stock,
      Category: p.category?.name,
      Featured: p.isFeatured ? "Yes" : "No",
      Bestseller: p.isBestSeller ? "Yes" : "No",
    }));

    const sheet = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Products");
    XLSX.writeFile(wb, `products_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("PRODUCT REPORT", 10, 10);
    const rows = filtered.map((p) => [
      new Date(p.createdAt).toLocaleString(),
      p.name,
      "₹" + p.price,
      p.stock,
      p.category?.name || "",
      p.isFeatured ? "Yes" : "No",
      p.isBestSeller ? "Yes" : "No",
    ]);

    autoTable(doc, {
      head: [["Date", "Name", "Price", "Stock", "Category", "Featured", "Best Seller"]],
      body: rows,
    });

    doc.save("products.pdf");
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          placeholder="Search..."
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

        {/* Date filters */}
        <div className="flex gap-2 items-end">
          <input
            type="date"
            className="border px-3 py-2 rounded-lg text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded-lg text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <FaDownload /> Excel
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <FaDownload /> PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b">
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Bestseller</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td>
                  <img
                    src={p.images?.[0]?.url}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-lg font-semibold tracking-wide
                      ${
                        p.stock === 0
                          ? "bg-red-500/10 text-red-600 border border-red-400"
                          : p.stock <= 50
                          ? "bg-yellow-500/10 text-yellow-700 border border-yellow-400"
                          : "bg-green-500/10 text-green-600 border border-green-400"
                      }`}
                  >
                    {p.stock === 0
                      ? "Out of Stock"
                      : p.stock <= 50
                      ? `Limited (${p.stock})`
                      : `Available (${p.stock})`}
                  </span>
                </td>
                <td>{p.category?.name}</td>
                <td>{p.isFeatured ? "Yes" : "No"}</td>
                <td>{p.isBestSeller ? "Yes" : "No"}</td>
                <td className="flex gap-2 justify-center">
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

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-8 select-none">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-2 border rounded-lg flex items-center gap-1 text-sm ${
            page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <MdNavigateBefore size={18} /> Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium border ${
                  p === page
                    ? "bg-orange-600 text-white border-orange-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          } else if (p === page - 2 || p === page + 2) {
            return (
              <span key={p} className="px-1 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-2 border rounded-lg flex items-center gap-1 text-sm ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Next <MdNavigateNext size={18} />
        </button>
      </div>

      {/* 📌 PRODUCT FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-xl">
            
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={submitForm} className="space-y-3">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border w-full p-2 rounded"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  placeholder="MRP"
                  className="border p-2 rounded"
                />
              </div>

              <input
                type="number"
                name="stock"
                value={form.stock}
                required
                onChange={handleChange}
                placeholder="Stock"
                className="border w-full p-2 rounded"
              />

              <input
                name="flavor"
                value={form.flavor}
                onChange={handleChange}
                placeholder="Flavor"
                className="border w-full p-2 rounded"
              />

              <input
                name="weight"
                value={form.weight}
                required
                onChange={handleChange}
                placeholder="Weight"
                className="border w-full p-2 rounded"
              />

              <select
                name="category"
                value={form.category}
                required
                onChange={handleChange}
                className="border w-full p-2 rounded"
              >
                <option>Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border w-full p-2 rounded"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                Featured
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={handleChange}
                />
                Best Seller
              </label>

              {/* IMAGE UPLOAD UI */}
              <label className="font-semibold text-sm">Images (Max 6)</label>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative border rounded-lg overflow-hidden">
                    <img src={img.preview} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/50 text-white rounded px-2 text-xs"
                      onClick={() => removeImage(i)}
                    >
                      X
                    </button>
                  </div>
                ))}

                {images.length < 6 && (
                  <label className="flex flex-col items-center justify-center border border-dashed rounded-lg h-28 cursor-pointer text-gray-500 hover:border-orange-500">
                    <FaCloudUploadAlt size={24} />
                    <span className="text-xs">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="px-5 py-2 bg-orange-600 text-white rounded-lg"
                >
                  {loadingSubmit ? "Saving..." : editMode ? "Update" : "Create"}
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
