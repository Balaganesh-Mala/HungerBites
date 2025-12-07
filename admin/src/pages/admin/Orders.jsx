import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(""); // YYYY-MM-DD

  const [page, setPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await adminApi.get("/admin/orders");
      // latest first
      const list = (res.data.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(list);
      setFiltered(list);
    } catch (err) {
      console.error("Order fetch failed", err);
    }
  };

  // 🔍 Search + Filters + Date Filters
  useEffect(() => {
    let data = [...orders];

    // Text search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(
        (o) =>
          o._id.toLowerCase().includes(s) ||
          o.user?.name?.toLowerCase().includes(s) ||
          o.user?.email?.toLowerCase().includes(s)
      );
    }

    // Order status filter
    if (statusFilter !== "all") {
      data = data.filter((o) => o.orderStatus === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== "all") {
      data = data.filter((o) => o.paymentMethod === paymentFilter);
    }

    // 📅 Date filter (createdAt between startDate & endDate)
    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      data = data.filter((o) => {
        const od = new Date(o.createdAt);
        return od >= sd;
      });
    }

    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      data = data.filter((o) => {
        const od = new Date(o.createdAt);
        return od <= ed;
      });
    }

    setFiltered(data);
    setPage(1); // reset to first page when filter changes
  }, [search, statusFilter, paymentFilter, startDate, endDate, orders]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const startIndex = (page - 1) * perPage;
  const paginatedData = filtered.slice(startIndex, startIndex + perPage);

  // 📤 Export Excel (full filtered data, not just current page)
  const exportExcel = () => {
    const formatted = [];

    filtered.forEach((o) => {
      o.orderItems.forEach((item) => {
        formatted.push({
          "Order Date": new Date(o.createdAt).toLocaleString(), // first column
          "Order ID": o._id,

          "Customer Name": o.user?.name || "N/A",
          "Customer Email": o.user?.email || "N/A",
          "Customer Phone": o.shippingAddress?.phone || "N/A",

          "Shipping Name": o.shippingAddress?.name || "N/A",
          "Shipping City": o.shippingAddress?.city || "N/A",
          "Shipping State": o.shippingAddress?.state || "N/A",
          "Shipping Pincode": o.shippingAddress?.pincode || "N/A",

          "Payment Method": o.paymentMethod,
          "Payment Status": o.paymentStatus || "Pending",

          "Order Status": o.orderStatus,
          "Tracking ID": o.trackingId || "N/A",

          "Product Name": item.productId?.name || item.name,
          "Product Qty": item.quantity,
          "Item Price": item.price,
          "Item Total": item.price * item.quantity,

          "Order Total Amount": o.totalPrice,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer]),
      `orders_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  // 📄 Export PDF (also uses filtered data)
  const exportPDF = () => {
    try {
      const doc = new jsPDF("landscape");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("FULL ORDER REPORT", 14, 10);

      let rows = [];

      filtered.forEach((order) => {
        order.orderItems.forEach((item) => {
          rows.push([
            new Date(order.createdAt).toLocaleString(),
            order._id,
            order.user?.name || "N/A",
            order.user?.email || "N/A",
            order.shippingAddress?.phone || "N/A",
            item.productId?.name || item.name,
            item.quantity,
            "₹" + item.price,
            "₹" + item.price * item.quantity,
            order.paymentMethod,
            order.paymentStatus || "Pending",
            order.orderStatus,
            order.trackingId || "N/A",
            "₹" + order.totalPrice,
          ]);
        });
      });

      autoTable(doc, {
        startY: 20,
        head: [
          [
            "Order Date",
            "Order ID",
            "Customer",
            "Email",
            "Phone",
            "Product",
            "Qty",
            "Price",
            "Item Total",
            "Payment",
            "Payment Status",
            "Order Status",
            "Tracking",
            "Order Total",
          ],
        ],
        body: rows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [255, 90, 0], textColor: "#fff" },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      doc.save("orders-report.pdf");
    } catch (error) {
      console.error(error);
      alert("PDF generation failed.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders Management</h1>

      {/* 🔍 Search + Filters Row */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by Order ID, name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full lg:w-1/3"
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

        {/* Payment Filter */}
        <select
          className="border px-4 py-2 rounded-lg"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="COD">COD</option>
          <option value="online">Online</option>
        </select>

        {/* 📅 Date Filters */}
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">From</span>
            <input
              type="date"
              className="border px-3 py-2 rounded-lg text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">To</span>
            <input
              type="date"
              className="border px-3 py-2 rounded-lg text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

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
        <table className="w-full text-left min-w-[900px]">
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
            {paginatedData.map((order) => (
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

        {paginatedData.length === 0 && (
          <p className="text-center text-slate-600 py-6">
            No orders found for this filter.
          </p>
        )}
      </div>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 select-none">
        {/* Prev Button */}
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`
      px-3 py-2 border rounded-lg flex items-center gap-1 text-sm
      ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
    `}
        >
          <MdNavigateBefore size={18} /> Prev
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`
            w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium border
            ${
              p === page
                ? "bg-orange-600 text-white border-orange-600"
                : "hover:bg-gray-100"
            }
          `}
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

        {/* Next Button */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`
      px-3 py-2 border rounded-lg flex items-center gap-1 text-sm
      ${
        page === totalPages
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-gray-100"
      }
    `}
        >
          Next <MdNavigateNext size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
