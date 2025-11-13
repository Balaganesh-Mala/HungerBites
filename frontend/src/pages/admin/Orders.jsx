import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await adminApi.get("/admin/orders");
      setOrders(res.data.orders);
      setFiltered(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 Search + Filters
  useEffect(() => {
    let data = [...orders];

    // Search
    if (search.trim() !== "") {
      data = data.filter(
        (o) =>
          o._id.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter((o) => o.orderStatus === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== "all") {
      data = data.filter((o) => o.paymentMethod === paymentFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, paymentFilter, orders]);

  // 📤 Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((o) => ({
        "Order ID": o._id,
        Customer: o.user?.name || "N/A",
        Email: o.user?.email || "N/A",
        Items: o.orderItems.length,
        Total: o.totalPrice,
        Status: o.orderStatus,
        Payment: o.paymentMethod,
        Date: new Date(o.createdAt).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(file, "orders.xlsx");
  };

  // 📄 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Orders Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Order ID", "Customer", "Total", "Status", "Payment", "Date"]],
      body: filtered.map((o) => [
        o._id,
        o.user?.name || "N/A",
        `₹${o.totalPrice}`,
        o.orderStatus,
        o.paymentMethod,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
      theme: "striped",
    });

    doc.save("orders.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders Management</h1>

      {/* 🔍 Search + Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
        />

        {/* Status Filter */}
        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Method Filter */}
        <select
          className="border px-4 py-2 rounded-lg"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="COD">COD</option>
          <option value="online">Online</option>
        </select>

        {/* Export Buttons */}
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b text-slate-600">
              <th className="py-3">Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-sm">{order._id}</td>
                <td>{order.user?.name || "-"}</td>
                <td>{order.orderItems.length}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>{order.paymentMethod.toUpperCase()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <a
                    href={`/admin/orders/${order._id}`}
                    className="text-orange-600 underline text-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-slate-600 py-6">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
