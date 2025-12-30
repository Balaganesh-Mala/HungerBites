import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minCartValue: "",
    maxDiscount: "",
    expiry: "",
  });

  /* ================= LOAD COUPONS ================= */
  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/coupons");
      setCoupons(res.data.coupons || []);
    } catch {
      Swal.fire("Error", "Failed to load coupons", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ================= CREATE COUPON ================= */
  const createCoupon = async () => {
    if (!form.code || !form.value || !form.expiry) {
      Swal.fire("Warning", "Required fields missing", "warning");
      return;
    }

    try {
      await adminApi.post("/coupons", {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minCartValue: Number(form.minCartValue || 0),
        maxDiscount:
          form.type === "PERCENT" ? Number(form.maxDiscount || 0) : undefined,
        expiry: form.expiry,
      });

      Swal.fire("Success", "Coupon created", "success");
      setShowModal(false);
      setForm({
        code: "",
        type: "PERCENT",
        value: "",
        minCartValue: "",
        maxDiscount: "",
        expiry: "",
      });
      loadCoupons();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Create failed",
        "error"
      );
    }
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleStatus = async (id, current) => {
    try {
      await adminApi.put(`/coupons/${id}`, { isActive: !current });
      loadCoupons();
    } catch {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  /* ================= DELETE COUPON ================= */
  const deleteCoupon = async (id) => {
    Swal.fire({
      title: "Delete coupon?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await adminApi.delete(`/coupons/${id}`);
        Swal.fire("Deleted", "Coupon removed", "success");
        loadCoupons();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Coupon Manager</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Coupon
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No coupons created yet
          </p>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Cart</th>
                <th>Max Discount</th>
                <th>Expiry</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="font-semibold">{c.code}</td>
                  <td>{c.type}</td>
                  <td>
                    {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}
                  </td>
                  <td>₹{c.minCartValue}</td>
                  <td>{c.maxDiscount ? `₹${c.maxDiscount}` : "-"}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        c.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(c._id, c.isActive)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      {c.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => deleteCoupon(c._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>

            <div className="space-y-3">
              <input
                name="code"
                placeholder="Coupon Code"
                className="border p-2 rounded w-full uppercase"
                value={form.code}
                onChange={handleChange}
              />

              <select
                name="type"
                className="border p-2 rounded w-full"
                value={form.type}
                onChange={handleChange}
              >
                <option value="PERCENT">Percentage</option>
                <option value="FLAT">Flat</option>
              </select>

              <input
                name="value"
                type="number"
                placeholder={form.type === "PERCENT" ? "Discount %" : "Flat Amount"}
                className="border p-2 rounded w-full"
                value={form.value}
                onChange={handleChange}
              />

              <input
                name="minCartValue"
                type="number"
                placeholder="Minimum Cart Value"
                className="border p-2 rounded w-full"
                value={form.minCartValue}
                onChange={handleChange}
              />

              {form.type === "PERCENT" && (
                <input
                  name="maxDiscount"
                  type="number"
                  placeholder="Max Discount"
                  className="border p-2 rounded w-full"
                  value={form.maxDiscount}
                  onChange={handleChange}
                />
              )}

              <input
                name="expiry"
                type="date"
                className="border p-2 rounded w-full"
                value={form.expiry}
                onChange={handleChange}
              />

              <button
                onClick={createCoupon}
                className="w-full bg-orange-600 text-white py-2 rounded"
              >
                Create Coupon
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 py-2 rounded"
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

export default AdminCoupons;
