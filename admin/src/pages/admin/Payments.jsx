import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Load payments
  const loadPayments = async () => {
    try {
      const res = await adminApi.get("/payment");
      setPayments(res.data.payments || []);
      setFiltered(res.data.payments || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load payments", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Search + Filters
  useEffect(() => {
    let data = payments;

    const s = search.toLowerCase();

    // Search filter
    data = data.filter(
      (p) =>
        p.razorpay_order_id?.toLowerCase().includes(s) ||
        p.razorpay_payment_id?.toLowerCase().includes(s) ||
        p.user?.email?.toLowerCase().includes(s)
    );

    // Status filter mapping DB → UI
    if (statusFilter !== "all") {
      data = data.filter((p) => {
        if (statusFilter === "Success") return p.status === "paid";
        if (statusFilter === "Failed") return p.status === "failed";
        if (statusFilter === "Pending") return p.status === "created";
        return true;
      });
    }

    setFiltered(data);
  }, [search, statusFilter, payments]);

  // Export XLSX
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        PaymentID: p.razorpay_payment_id || "N/A",
        OrderID: p.razorpay_order_id || "N/A",
        Status:
          p.status === "paid"
            ? "Success"
            : p.status === "failed"
            ? "Failed"
            : "Pending",
        Amount: p.amount,
        Email: p.user?.email || "N/A",
        CreatedAt: new Date(p.createdAt).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payments Report", 14, 10);

    const tableData = filtered.map((p) => [
      p.razorpay_payment_id || "N/A",
      p.razorpay_order_id || "N/A",
      p.user?.email || "N/A",
      p.amount,
      p.status === "paid"
        ? "Success"
        : p.status === "failed"
        ? "Failed"
        : "Pending",
      new Date(p.createdAt).toLocaleDateString(),
    ]);

    doc.autoTable({
      startY: 20,
      head: [["Payment ID", "Order ID", "Email", "Amount", "Status", "Date"]],
      body: tableData,
    });

    doc.save("payments.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search payments..."
          className="p-3 border rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Export Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center p-6">Loading payments...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center p-6">No payments found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Payment ID</th>
                <th className="py-2">Order ID</th>
                <th className="py-2">User</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-sm">
                    {p.razorpay_payment_id || "N/A"}
                  </td>
                  <td className="py-3 text-sm">
                    {p.razorpay_order_id || "N/A"}
                  </td>
                  <td className="py-3 text-sm">{p.user?.email || "N/A"}</td>
                  <td className="py-3 text-sm">₹{p.amount}</td>

                  <td className="py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : p.status === "failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {p.status === "paid"
                        ? "Success"
                        : p.status === "failed"
                        ? "Failed"
                        : "Pending"}
                    </span>
                  </td>

                  <td className="py-3 text-sm">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payments;
