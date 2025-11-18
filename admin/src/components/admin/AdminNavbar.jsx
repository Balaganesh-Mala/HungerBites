import { useState, useContext, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import { getPublicSettings } from "../../api/settings.api";

const AdminNavbar = ({ toggleSidebar }) => {
  const { admin, logout } = useContext(AdminAuthContext);
  const [logo, setLogo] = useState(null);

  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        const logoUrl = res.data.settings?.logo?.[0]?.url;
        setLogo(logoUrl);
      } catch (err) {
        console.log("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-40 h-16 flex items-center px-4 md:ml-64">
      {/* MOBILE MENU BUTTON */}
      <button className="md:hidden mr-4" onClick={toggleSidebar}>
        <FiMenu size={26} />
      </button>

      {/* LOGO */}
      <div className="flex items-center">
        <img src={logo} alt="Admin Logo" className="h-10" />
      </div>

      <div className="flex-1"></div>

      {/* RIGHT SIDE ICONS */}
      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS */}
        <button className="relative hover:text-orange-600 transition">
          <FiBell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-[6px] rounded-full">
            3
          </span>
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="h-8 w-8 rounded-full"
              alt="admin avatar"
            />
          </button>

          {/* DROPDOWN */}
          {openProfile && (
            <div
              className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-lg border p-4 text-sm z-50"
              onMouseLeave={() => setOpenProfile(false)}
            >
              <p className="font-semibold">{admin?.name}</p>
              <p className="text-gray-600 text-xs mb-3">{admin?.email}</p>

              <div className="h-[1px] bg-gray-200 my-2"></div>

              <button
                onClick={() => {
                  logout();
                  window.location.href = "/admin/login";
                }}
                className="text-red-600 w-full text-left hover:bg-red-50 px-2 py-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
