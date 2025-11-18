import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";
import { TbCategory2 } from "react-icons/tb";


const AdminSidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Categories", path: "/admin/categories", icon: <TbCategory2 /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
    { name: "Payments", path: "/admin/payments", icon: <FiTrendingUp /> },
    { name: "Settings", path: "/admin/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* BACKDROP for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-64"}
        md:translate-x-0
      `}
      >
        {/* SIDEBAR HEADER */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
        </div>

        {/* MENU */}
        <nav className="mt-4">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setOpen(false)} // close sidebar on mobile
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium
                  transition border-l-4
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600 border-orange-600"
                      : "text-gray-700 border-transparent hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
