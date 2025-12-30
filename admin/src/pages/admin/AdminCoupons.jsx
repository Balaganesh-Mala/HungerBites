import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import TableSkeleton from "../../components/admin/TableSkeleton";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Manager</h1>
          <p className="text-sm text-gray-500">
            Create & manage discount coupons for checkout
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow"
        >
          + Create Coupon
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
  {loading ? (
    <div className="p-6">
      <TableSkeleton />
    </div>
  ) : coupons.length === 0 ? (
    <div className="py-14 text-center">
      <p className="text-gray-500 text-sm">
        No coupons created yet
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Create your first coupon to boost conversions
      </p>
    </div>
  ) : (
    <table className="w-full min-w-[900px] text-sm border-collapse">
      {/* TABLE HEAD */}
      <thead className="bg-gray-50 border-b sticky top-0 z-10">
        <tr className="text-gray-600 text-left">
          <th className="px-4 py-3">Code</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Value</th>
          <th className="px-4 py-3">Min Cart</th>
          <th className="px-4 py-3">Max Discount</th>
          <th className="px-4 py-3">Expiry</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody>
        {coupons.map((c) => {
          const isExpired = new Date(c.expiry) < new Date();

          return (
            <tr
              key={c._id}
              className="border-b hover:bg-gray-50 transition align-middle"
            >
              {/* CODE */}
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold tracking-wide">
                  {c.code}
                </span>
              </td>

              {/* TYPE */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    c.type === "PERCENT"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {c.type === "PERCENT" ? "Percent" : "Flat"}
                </span>
              </td>

              {/* VALUE */}
              <td className="px-4 py-3 font-semibold text-gray-900">
                {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}
              </td>

              {/* MIN CART */}
              <td className="px-4 py-3 text-gray-700">
                ₹{c.minCartValue}
              </td>

              {/* MAX DISCOUNT */}
              <td className="px-4 py-3 text-gray-700">
                {c.maxDiscount ? `₹${c.maxDiscount}` : "—"}
              </td>

              {/* EXPIRY */}
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium ${
                    isExpired ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {new Date(c.expiry).toLocaleDateString()}
                </span>
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(c._id, c.isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      c.isActive
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {c.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteCoupon(c._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>



      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-1">Create New Coupon</h2>
            <p className="text-sm text-gray-500 mb-5">
              Configure discount rules for checkout
            </p>

            <div className="space-y-4">
              <input
                name="code"
                placeholder="Coupon Code (e.g. SAVE10)"
                className="border rounded-lg px-3 py-2 w-full uppercase"
                value={form.code}
                onChange={handleChange}
              />

              <select
                name="type"
                className="border rounded-lg px-3 py-2 w-full"
                value={form.type}
                onChange={handleChange}
              >
                <option value="PERCENT">Percentage Discount</option>
                <option value="FLAT">Flat Discount</option>
              </select>

              <input
                name="value"
                type="number"
                placeholder={
                  form.type === "PERCENT" ? "Discount %" : "Flat Amount (₹)"
                }
                className="border rounded-lg px-3 py-2 w-full"
                value={form.value}
                onChange={handleChange}
              />

              <input
                name="minCartValue"
                type="number"
                placeholder="Minimum Cart Value (₹)"
                className="border rounded-lg px-3 py-2 w-full"
                value={form.minCartValue}
                onChange={handleChange}
              />

              {form.type === "PERCENT" && (
                <input
                  name="maxDiscount"
                  type="number"
                  placeholder="Max Discount (₹)"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={form.maxDiscount}
                  onChange={handleChange}
                />
              )}

              <input
                name="expiry"
                type="date"
                className="border rounded-lg px-3 py-2 w-full"
                value={form.expiry}
                onChange={handleChange}
              />

              <button
                onClick={async () => {
                  setCreating(true);
                  await createCoupon();
                  setCreating(false);
                }}
                disabled={creating}
                className={`w-full py-2.5 rounded-xl font-semibold text-white ${
                  creating ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {creating ? "Creating..." : "Create Coupon"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
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
