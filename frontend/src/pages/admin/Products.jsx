import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await adminApi.get("/products");
      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProduct = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await adminApi.delete(`/products/${id}`);
      Swal.fire("Deleted!", "Product has been removed", "success");
      loadProducts();
    } catch (err) {
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full border p-3 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-slate-600 border-b">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={p.images?.[0]?.url || p.images?.[0]}
                    className="h-14 w-14 object-cover rounded"
                  />
                </td>

                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.category?.name || "-"}</td>

                <td className="p-3 text-right">
                  <Link
                    to={`/admin/products/edit/${p._id}`}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
