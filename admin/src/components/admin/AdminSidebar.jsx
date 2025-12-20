import { Link, useLocation } from "react-router-dom";
import { useAdminNotifications } from "../../context/AdminNotificationContext";

import {
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiTrendingUp,
  FiMessageCircle,
  FiEdit2,
} from "react-icons/fi";
import { TbCategory2 } from "react-icons/tb";

const AdminSidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { unreadMessages } = useAdminNotifications();


  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Categories", path: "/admin/categories", icon: <TbCategory2 /> },
    { name: "Customers", path: "/admin/users", icon: <FiUsers /> },
    { name: "Payments", path: "/admin/payments", icon: <FiTrendingUp /> },
    { name: "Blog", path: "/admin/blogs", icon: <FiEdit2 /> },
    { name: "Messages", path: "/admin/messages", icon: <FiMessageCircle /> },
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
                <span className="relative text-lg">
                  {item.icon}

                  {item.name === "Messages" && unreadMessages > 0 && (
                    <span
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
                     bg-red-600 text-white text-[10px]
                     rounded-full flex items-center justify-center"
                    >
                      {unreadMessages}
                    </span>
                  )}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
