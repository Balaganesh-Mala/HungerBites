import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiLoader, FiX } from "react-icons/fi"; // ✅ added FiX

const BlogManager = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    readMoreLink: "",
    socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
    image: null
  });

  const loadBlogs = async () => {
    try {
      const res = await adminApi.get("/blogs");
      setBlogs(res.data.blogs || []);
    } catch {
      Swal.fire("Error", "Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      readMoreLink: "",
      socialLinks: { facebook:"", instagram:"", linkedin:"", twitter:"" },
      image: null
    });
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setEditingId(blog._id);
    setEditingBlogId(blog._id);
    setForm({
      title: blog.title,
      description: blog.description,
      readMoreLink: blog.readMoreLink,
      socialLinks: blog.socialLinks,
      image: null
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.readMoreLink) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("readMoreLink", form.readMoreLink);
    fd.append("socialLinks", JSON.stringify(form.socialLinks));

    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      setProcessingId(editingId);

      if (editingId) {
        await adminApi.put(`/blogs/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        Swal.fire("Updated ✅", "Blog updated successfully", "success");
      } else {
        await adminApi.post("/blogs", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        Swal.fire("Created ✅", "Blog added successfully", "success");
      }

      setShowForm(false);  // ✅ Close form after submit
      setEditingBlogId(null);
      loadBlogs();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Blog submission failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const closeForm = () => setShowForm(false); // ✅ close handler

  const deleteBlog = async (id) => {
    const ok = await Swal.fire({ icon:"question", title:"Delete this blog?", showCancelButton:true });
    if (!ok.isConfirmed) return;

    try {
      setProcessingId(id);
      await adminApi.delete(`/blogs/${id}`);
      Swal.fire("Deleted 🗑", "Blog removed successfully", "success");
      setBlogs(blogs.filter(b => b._id !== id));
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-gray-400" size={26} />
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto py-6 px-4">

      {/* ✅ ADD BLOG BUTTON TOGGLE */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => (showForm ? closeForm() : openCreateForm())} // ✅ toggle open/close
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm shadow hover:scale-105 transition"
        >
          <FiPlus size={15} /> {showForm ? "Close Form ❌" : "Add Blog"}
        </button>
      </div>

      {/* ✅ BLOG FORM MODAL */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex justify-center items-center bg-black/40"
        >
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[400px] z-[1000]">

            {/* ✅ CLOSE ICON BUTTON (TOP RIGHT) */}
            <button
              onClick={closeForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
            >
              <FiX size={20} />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {editingId ? "Update Blog ✏" : "Create Blog 📝"}
              </h3>

              <input
                placeholder="Blog Title"
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                placeholder="Blog Description"
                className="w-full border rounded p-3 text-sm h-[110px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input
                placeholder="Read More Link"
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.readMoreLink}
                onChange={(e) => setForm({ ...form, readMoreLink: e.target.value })}
              />

              <input
                type="file"
                className="w-full text-sm border p-2 rounded"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />

              <button
                type="submit"
                className="bg-orange-600 text-white w-full py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition"
              >
                {processingId === editingId ? <><FiLoader className="animate-spin inline mr-2" />Saving…</> : editingId ? "Update ✅" : "Create ✅"}
              </button>
            </form>
          </div>
        </motion.div>
      )}
      {/* ✅ FIXED HEADING TAGS */}
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Manage Blogs</h2>

      {/* ✅ BLOG CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {blogs.map((b, i) => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border shadow rounded-xl overflow-hidden"
          >
            <img src={b.image?.url} alt={b.title} className="w-full h-36 object-cover" />
            <div className="p-3">
              <p className="font-semibold text-xs truncate">{b.title}</p>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{b.description}</p>
            </div>
            <div className="flex justify-between border-t p-2">
              <button onClick={() => openEditForm(b)} className="text-blue-600"><FiEdit2 size={15} /></button>
              <button onClick={() => deleteBlog(b._id)} className="text-red-600"><FiTrash2 size={15} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogManager;
