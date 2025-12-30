import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    order: 0,
    image: null,
  });

  /* ================= LOAD SLIDES ================= */
  const loadSlides = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/hero");
      setSlides(res.data.slides || []);
    } catch {
      Swal.fire("Error", "Failed to load hero banners", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  /* ================= OPEN FORM ================= */
  const openCreate = () => {
    setEditId(null);
    setForm({
      title: "",
      subtitle: "",
      buttonText: "",
      order: 0,
      image: null,
    });
    setShowForm(true);
  };

  const openEdit = (slide) => {
    setEditId(slide._id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      order: slide.order,
      image: null,
    });
    setShowForm(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.subtitle || !form.buttonText) {
      Swal.fire("Warning", "All fields are required", "warning");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("buttonText", form.buttonText);
    fd.append("order", form.order);
    if (form.image) fd.append("image", form.image);

    try {
      editId
        ? await adminApi.put(`/hero/${editId}`, fd)
        : await adminApi.post("/hero/create", fd);

      Swal.fire("Success", editId ? "Slide updated" : "Slide created", "success");
      setShowForm(false);
      loadSlides();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Action failed",
        "error"
      );
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (slide) => {
    try {
      await adminApi.put(`/hero/${slide._id}`, {
        isActive: !slide.isActive,
      });
      loadSlides();
    } catch {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const deleteSlide = async (id) => {
    Swal.fire({
      title: "Delete slide?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await adminApi.delete(`/hero/${id}`);
        Swal.fire("Deleted", "Slide removed", "success");
        loadSlides();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Hero Banner Manager</h1>
          <p className="text-sm text-gray-500">
            Manage homepage slider banners
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Slide
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Slide" : "Create Slide"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              placeholder="Button Text"
              value={form.buttonText}
              onChange={(e) =>
                setForm({ ...form, buttonText: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <input
              type="number"
              placeholder="Order (0 = first)"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-5 py-2 rounded-lg"
              >
                {editId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SLIDE LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Loading banners...</p>
        ) : slides.length === 0 ? (
          <p className="text-gray-500">No slides created yet</p>
        ) : (
          slides.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              <img
                src={s.image?.url}
                alt={s.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{s.title}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      s.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{s.subtitle}</p>
                <p className="text-xs text-gray-400">
                  Button: {s.buttonText} | Order: {s.order}
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="flex-1 border rounded-lg py-1.5 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(s)}
                    className="flex-1 border rounded-lg py-1.5 text-sm"
                  >
                    {s.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteSlide(s._id)}
                    className="flex-1 bg-red-500 text-white rounded-lg py-1.5 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHero;
