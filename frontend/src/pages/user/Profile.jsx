import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getMyProfileApi,
  updateProfileApi,
  updateAddressApi,
} from "../../api/profile.api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Load profile data
  const loadProfile = async () => {
    try {
      const res = await getMyProfileApi();
      const u = res.data.user;

      setUser(u);
      setProfile({ name: u.name, phone: u.phone || "" });

      if (u.addresses?.length > 0) {
        setAddress({ ...u.addresses[0] });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load profile", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Update profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfileApi(profile);

      Swal.fire("Success", "Profile updated successfully!", "success");
      loadProfile();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
    setSaving(false);
  };

  // Update address
  const handleSaveAddress = async () => {
    setSaving(true);
    try {
      await updateAddressApi(address);

      Swal.fire("Success", "Address updated successfully!", "success");
      loadProfile();
    } catch (err) {
      Swal.fire("Error", "Failed to update address", "error");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-900 mb-8">My Profile</h1>

      {/* USER DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Profile Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded bg-gray-100 cursor-not-allowed md:col-span-2"
            value={user.email}
            readOnly
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Street"
            className="border p-3 rounded"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />

          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          <input
            type="text"
            placeholder="State"
            className="border p-3 rounded"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />

          <input
            type="text"
            placeholder="Pincode"
            className="border p-3 rounded"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone"
            className="border p-3 rounded md:col-span-2"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />
        </div>

        <button
          onClick={handleSaveAddress}
          disabled={saving}
          className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
