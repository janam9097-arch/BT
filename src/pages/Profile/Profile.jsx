import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({
    full_name: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
    is_default: true,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await authService.getAddresses();
        setAddresses(data.results || data || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await authService.addAddress(newAddr);
      const data = await authService.getAddresses();
      setAddresses(data.results || data || []);
      setNewAddr({
        full_name: "",
        phone_number: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "USA",
        is_default: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword(oldPassword, newPassword);
      setPwdMsg("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (_err) {
      setPwdMsg("Failed to update password. Check your old password.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h2 style={{ color: "#D4AF37", margin: "0 0 5px 0" }}>My Account</h2>
            <p style={{ color: "#aaa", margin: 0 }}>Welcome, {user?.first_name || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          {["info", "addresses", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#D4AF37" : "#111",
                color: activeTab === tab ? "#000" : "#fff",
                border: "1px solid #D4AF37",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab === "info" ? "Personal Info" : tab === "addresses" ? "Saved Addresses" : "Security"}
            </button>
          ))}
          <Link
            to="/orders"
            style={{
              background: "#111",
              color: "#D4AF37",
              border: "1px solid #D4AF37",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            My Orders
          </Link>
        </div>

        {/* Tab 1: Info */}
        {activeTab === "info" && (
          <div style={{ background: "#111", padding: "30px", borderRadius: "10px", border: "1px solid #333" }}>
            <h3 style={{ color: "#D4AF37", marginTop: 0 }}>User Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>First Name:</strong> {user?.first_name}</p>
                <p><strong>Last Name:</strong> {user?.last_name}</p>
              </div>
              <div>
                <p><strong>Phone:</strong> {user?.phone_number || "Not specified"}</p>
                <p><strong>Account Status:</strong> <span style={{ color: "#4caf50" }}>Active VIP</span></p>
                <p><strong>Email Verified:</strong> {user?.is_email_verified ? "Yes" : "Verified"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
              {addresses.map((addr) => (
                <div key={addr.id} style={{ background: "#111", padding: "20px", borderRadius: "8px", border: addr.is_default ? "2px solid #D4AF37" : "1px solid #333" }}>
                  {addr.is_default && <span style={{ background: "#D4AF37", color: "#000", fontSize: "12px", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" }}>DEFAULT</span>}
                  <h4 style={{ margin: "10px 0 5px 0" }}>{addr.full_name}</h4>
                  <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>{addr.street_address}</p>
                  <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>{addr.city}, {addr.state} {addr.postal_code}</p>
                  <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>Phone: {addr.phone_number}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAddress} style={{ background: "#111", padding: "25px", borderRadius: "8px", border: "1px solid #333" }}>
              <h4 style={{ color: "#D4AF37", marginTop: 0 }}>Add New Address</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <input
                  placeholder="Full Name"
                  required
                  value={newAddr.full_name}
                  onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })}
                  style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
                />
                <input
                  placeholder="Phone Number"
                  required
                  value={newAddr.phone_number}
                  onChange={(e) => setNewAddr({ ...newAddr, phone_number: e.target.value })}
                  style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
                />
              </div>
              <input
                placeholder="Street Address"
                required
                value={newAddr.street_address}
                onChange={(e) => setNewAddr({ ...newAddr, street_address: e.target.value })}
                style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", marginBottom: "15px", boxSizing: "border-box" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <input
                  placeholder="City"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
                />
                <input
                  placeholder="State"
                  required
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
                />
                <input
                  placeholder="Postal Code"
                  required
                  value={newAddr.postal_code}
                  onChange={(e) => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                  style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }}
                />
              </div>
              <button type="submit" style={{ background: "#D4AF37", color: "#000", border: "none", padding: "12px 24px", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}>
                Save Address
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordChange} style={{ background: "#111", padding: "30px", borderRadius: "10px", border: "1px solid #333", maxWidth: "500px" }}>
            <h3 style={{ color: "#D4AF37", marginTop: 0 }}>Change Password</h3>
            {pwdMsg && <p style={{ color: "#D4AF37" }}>{pwdMsg}</p>}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            <button type="submit" style={{ background: "#D4AF37", color: "#000", border: "none", padding: "12px 24px", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}>
              Update Password
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
