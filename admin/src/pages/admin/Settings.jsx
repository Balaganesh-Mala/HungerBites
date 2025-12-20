import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";
import { getPublicSettings } from "../../api/settings.api";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false); // ✅ NEW
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
    logo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load settings
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [adminRes, publicRes] = await Promise.all([
          adminApi.get("/settings"),
          getPublicSettings(),
        ]);

        setForm(adminRes.data.settings);
        setLogoPreview(publicRes.data.settings?.logo?.[0]?.url || "");
      } catch {
        Swal.fire("Error", "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // Upload Logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true); // ✅ START LOADING

    const body = new FormData();
    body.append("logo", file);

    try {
      const res = await adminApi.put("/settings", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.settings.logo[0].url;
      setForm((prev) => ({ ...prev, logo: url }));
      setLogoPreview(url);

      Swal.fire("Uploaded", "Logo updated successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to upload logo", "error");
    } finally {
      setUploadingLogo(false); // ✅ END LOADING
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminApi.put("/settings", form);
      Swal.fire("Saved", "Settings updated successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage store information and branding
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STORE DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Store Details
          </h2>

          <div>
            <label className="text-sm text-gray-600">Store Name</label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Support Email</label>
            <input
              type="email"
              name="supportEmail"
              value={form.supportEmail}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Support Phone</label>
            <input
              type="text"
              name="supportPhone"
              value={form.supportPhone}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* BRANDING */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Branding</h2>

          <div className="flex items-center gap-6">
            {/* LOGO PREVIEW WITH LOADER */}
            <div className="relative">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className={`h-20 w-20 object-contain border rounded-xl ${
                    uploadingLogo ? "opacity-50" : ""
                  }`}
                />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  No Logo
                </div>
              )}

              {/* LOADER OVERLAY */}
              {uploadingLogo && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                  <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* UPLOAD */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Upload Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="text-sm disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                {uploadingLogo
                  ? "Uploading logo…"
                  : "Recommended: square PNG or SVG"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
