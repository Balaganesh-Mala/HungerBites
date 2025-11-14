import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/category.api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Modal data (used for both create + edit)
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  // Load categories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoriesApi();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load categories", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Open Create Modal
  const openCreateModal = () => {
    setEditId(null);
    setForm({ name: "", description: "", image: null });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (cat) => {
    setEditId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description,
      image: null, // keep image unchanged unless uploading new
    });
    setShowModal(true);
  };

  // Handle Form Submit
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Swal.fire("Warning", "Name is required", "warning");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      if (editId) {
        await updateCategoryApi(editId, fd);
        Swal.fire("Updated!", "Category updated", "success");
      } else {
        await createCategoryApi(fd);
        Swal.fire("Created!", "Category added", "success");
      }
      loadCategories();
      setShowModal(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteCategoryApi(id);
        Swal.fire("Deleted!", "Category removed", "success");
        loadCategories();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    });
  };

  // Filtered Search
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search category..."
        className="border p-2 rounded-lg w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category Table */}
      <div className="bg-white p-4 shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-600">
              <th className="py-3">Image</th>
              <th className="py-3">Name</th>
              <th className="py-3">Description</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat._id} className="border-b">
                <td className="py-3">
                  <img
                    src={cat.image?.url || "https://via.placeholder.com/50"}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="py-3 font-medium">{cat.name}</td>
                <td className="py-3 text-sm">{cat.description}</td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-5 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category Name"
                className="border p-2 rounded w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
                className="border p-2 rounded w-full"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
              >
                {editId ? "Update Category" : "Create Category"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
