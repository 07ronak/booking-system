// src/app/drivers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Driver {
  _id: string;
  name: string;
  carDetails: string;
  availability?: "Available" | "Unavailable";
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const [carDetails, setCarDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      if (data.success) {
        setDrivers(data.data);
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, carDetails }),
      });

      const data = await res.json();

      if (data.success) {
        setName("");
        setCarDetails("");
        fetchDrivers();
      } else {
        setError(data.error || "Failed to add driver");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (
    driverId: string,
    currentStatus: string
  ) => {
    setUpdatingId(driverId);
    try {
      const newStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";
      const res = await fetch(`/api/drivers/${driverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        fetchDrivers();
      } else {
        setError(data.error || "Failed to update availability");
      }
    } catch (err) {
      setError("An error occurred while updating availability");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Driver Management
        </h1>

        {/* Add Driver Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Add New Driver
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                placeholder="Enter driver name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Details
              </label>
              <input
                type="text"
                value={carDetails}
                onChange={(e) => setCarDetails(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                placeholder="e.g., Toyota Camry - ABC123"
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors text-sm sm:text-base"
            >
              {loading ? "Adding..." : "Add Driver"}
            </button>
          </form>
        </div>

        {/* Drivers List */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            All Drivers
          </h2>
          {drivers.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
              No drivers added yet. Add your first driver above!
            </p>
          ) : (
            <div className="space-y-3">
              {drivers.map((driver) => {
                const availability = driver.availability || "Available";
                const isAvailable = availability === "Available";

                return (
                  <div
                    key={driver._id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {driver.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                          {driver.carDetails}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Status pill */}
                        <div
                          className={`${
                            isAvailable
                              ? "bg-green-50 border border-green-300 text-green-700"
                              : "bg-red-50 border border-red-300 text-red-700"
                          } px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm`}
                        >
                          {availability}
                        </div>

                        {/* Action button */}
                        <button
                          onClick={() =>
                            toggleAvailability(driver._id, availability)
                          }
                          disabled={updatingId === driver._id}
                          className={`${
                            isAvailable
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50`}
                        >
                          {updatingId === driver._id
                            ? "Updating..."
                            : isAvailable
                            ? "Set Unavailable"
                            : "Set Available"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
