import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaShieldAlt, FaBox } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import "./Profile.css";

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
    } catch {
      setPwdMsg("Failed to update password. Check your old password.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const tabs = [
    { id: "info", label: "Personal Info", icon: <FaUser className="tab-icon" /> },
    { id: "addresses", label: "Addresses", icon: <FaMapMarkerAlt className="tab-icon" /> },
    { id: "security", label: "Security", icon: <FaShieldAlt className="tab-icon" /> },
  ];

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-info">
          <h2>My Account</h2>
          <p>Welcome, {user?.first_name || user?.email}</p>
        </div>
        <button onClick={handleLogout} className="profile-logout-btn">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`profile-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <Link to="/orders" className="profile-tab-btn">
          <FaBox className="tab-icon" />
          My Orders
        </Link>
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === "info" && (
        <div className="profile-card">
          <h3 className="profile-card-title">User Profile</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Username</span>
              <span className="profile-info-value">{user?.username || "—"}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">First Name</span>
              <span className="profile-info-value">{user?.first_name || "—"}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Last Name</span>
              <span className="profile-info-value">{user?.last_name || "—"}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">{user?.phone_number || "Not specified"}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Account Status</span>
              <span className="profile-info-value status-active">Active VIP</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email Verified</span>
              <span className="profile-info-value">{user?.is_email_verified ? "Yes" : "Verified"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === "addresses" && (
        <div>
          {/* Saved Addresses */}
          <div className="profile-addresses-grid">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`profile-address-card ${addr.is_default ? "default" : ""}`}
              >
                {addr.is_default && (
                  <span className="profile-address-default-badge">DEFAULT</span>
                )}
                <h4 className="profile-address-name">{addr.full_name}</h4>
                <p className="profile-address-detail">{addr.street_address}</p>
                <p className="profile-address-detail">
                  {addr.city}, {addr.state} {addr.postal_code}
                </p>
                <p className="profile-address-detail">Phone: {addr.phone_number}</p>
              </div>
            ))}
          </div>

          {/* Add New Address Form */}
          <form onSubmit={handleAddAddress} className="profile-card">
            <h3 className="profile-card-title">Add New Address</h3>
            <div className="profile-form-grid">
              <input
                className="profile-input"
                placeholder="Full Name"
                required
                value={newAddr.full_name}
                onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="Phone Number"
                required
                value={newAddr.phone_number}
                onChange={(e) => setNewAddr({ ...newAddr, phone_number: e.target.value })}
              />
            </div>
            <input
              className="profile-input profile-input-full"
              placeholder="Street Address"
              required
              value={newAddr.street_address}
              onChange={(e) => setNewAddr({ ...newAddr, street_address: e.target.value })}
            />
            <div className="profile-form-grid-3">
              <input
                className="profile-input"
                placeholder="City"
                required
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="State"
                required
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="Postal Code"
                required
                value={newAddr.postal_code}
                onChange={(e) => setNewAddr({ ...newAddr, postal_code: e.target.value })}
              />
            </div>
            <button type="submit" className="profile-submit-btn">
              Save Address
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === "security" && (
        <form
          onSubmit={handlePasswordChange}
          className="profile-card profile-security-form"
        >
          <h3 className="profile-card-title">Change Password</h3>
          {pwdMsg && <div className="profile-pwd-message">{pwdMsg}</div>}
          <div style={{ marginBottom: "14px" }}>
            <label className="profile-form-label">Current Password</label>
            <input
              className="profile-input"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label className="profile-form-label">New Password</label>
            <input
              className="profile-input"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="profile-submit-btn">
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;
