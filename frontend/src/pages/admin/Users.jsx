import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch All Users
  const loadUsers = async () => {
    try {
      const res = await adminApi.get("/admin/users");
      setUsers(res.data.users || []);
      setFiltered(res.data.users || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Search
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
      )
    );
  }, [search, users]);

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((u) => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phone || "N/A",
        CreatedAt: new Date(u.createdAt).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users List", 14, 10);

    const tableData = filtered.map((u) => [
      u.name,
      u.email,
      u.phone || "N/A",
      new Date(u.createdAt).toLocaleString(),
    ]);

    doc.autoTable({
      startY: 20,
      head: [["Name", "Email", "Phone", "Created"]],
      body: tableData,
    });

    doc.save("users.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>

      {/* Search + Export Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search users..."
          className="p-3 border rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
          <p className="text-center p-6">Loading users...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center p-6">No users found.</p>
        ) : (
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Joined</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">{u.phone || "N/A"}</td>
                  <td className="py-3">
                    {new Date(u.createdAt).toLocaleDateString()}
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

export default Users;
