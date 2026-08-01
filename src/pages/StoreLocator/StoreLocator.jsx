import React, { useState } from "react";
import "./StoreLocator.css";

const stores = [
  {
    id: 1,
    name: "Bangaru Threads Flagship - Fifth Ave",
    city: "New York",
    address: "740 Fifth Avenue, Suite 120, New York, NY 10019",
    phone: "+1 (212) 555-0192",
    hours: "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 6:00 PM",
    status: "Open Now",
    lat: 40.7624,
    lng: -73.9738,
  },
  {
    id: 2,
    name: "Bangaru Threads - Rodeo Drive",
    city: "Los Angeles",
    address: "450 N Rodeo Drive, Beverly Hills, CA 90210",
    phone: "+1 (310) 555-0841",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM | Sun: 12:00 PM – 5:00 PM",
    status: "Open Now",
    lat: 34.0696,
    lng: -118.4031,
  },
  {
    id: 3,
    name: "Bangaru Threads - Bond Street",
    city: "London",
    address: "16 New Bond Street, Mayfair, London W1S 3SU",
    phone: "+44 20 7946 0912",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM | Sun: 12:00 PM – 6:00 PM",
    status: "Open Now",
    lat: 51.5126,
    lng: -0.1425,
  },
  {
    id: 4,
    name: "Bangaru Threads - Ginza Boutique",
    city: "Tokyo",
    address: "6-9-5 Ginza, Chuo-ku, Tokyo 104-0061",
    phone: "+81 3 5555 0143",
    hours: "Everyday: 11:00 AM – 8:00 PM",
    status: "Open Now",
    lat: 35.6713,
    lng: 139.7651,
  },
];

function StoreLocator() {
  const [query, setQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="locator-page">
      <div className="locator-header">
        <h1>Store Locator</h1>
        <p>Find a Bangaru Threads boutique or authorized retailer near you.</p>
      </div>

      <div className="locator-search-bar">
        <input
          type="text"
          placeholder="Search by city, address, or store name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="locator-layout">
        <div className="locator-stores-list">
          {filteredStores.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", padding: "30px 0" }}>
              No store boutiques found matching "{query}".
            </div>
          ) : (
            filteredStores.map((store) => (
              <div
                key={store.id}
                className={`store-card ${selectedStore?.id === store.id ? "selected" : ""}`}
                onClick={() => setSelectedStore(store)}
              >
                <div className="store-card-header">
                  <h3>{store.name}</h3>
                  <span className="store-status">{store.status}</span>
                </div>
                <div className="store-address">{store.address}</div>
                <div className="store-meta">
                  <div>📞 {store.phone}</div>
                  <div>🕒 {store.hours}</div>
                </div>
                <div className="store-actions">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-btn"
                  >
                    Get Directions ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="locator-map-container">
          {selectedStore && (
            <div className="map-placeholder-content">
              <h3>{selectedStore.name}</h3>
              <p>{selectedStore.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(selectedStore.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
              >
                Open Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreLocator;
