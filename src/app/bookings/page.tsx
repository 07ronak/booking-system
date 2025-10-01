// src/app/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Driver {
  _id: string;
  name: string;
  carDetails: string;
}

interface Booking {
  _id: string;
  customerName: string;
  pickupLocation: string;
  dropLocation: string;
  driverId: string;
  status: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDrivers();
    fetchBookings();
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

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          pickupLocation,
          dropLocation,
          driverId: selectedDriver,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCustomerName("");
        setPickupLocation("");
        setDropLocation("");
        setSelectedDriver("");
        fetchBookings();
      } else {
        setError(data.error || "Failed to create booking");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        fetchBookings();
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find((d) => d._id === driverId);
    return driver ? driver.name : "Unknown Driver";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Booking Management
        </h1>

        {/* Add Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Create New Booking
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                  required
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.carDetails}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                  placeholder="Enter pickup location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop Location
                </label>
                <input
                  type="text"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                  placeholder="Enter drop location"
                  required
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </form>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            All Bookings
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
              No bookings yet. Create your first booking above!
            </p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Customer Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Route
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Assigned Driver
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Booking Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {booking.customerName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {booking.pickupLocation} → {booking.dropLocation}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {getDriverName(booking.driverId)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {booking.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking._id, "Completed")
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking._id, "Cancelled")
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Finished
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {getDriverName(booking.driverId)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="flex items-center gap-1">
                        <span className="font-medium">From:</span>{" "}
                        {booking.pickupLocation}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="font-medium">To:</span>{" "}
                        {booking.dropLocation}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      {booking.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "Completed")
                            }
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() =>
                              updateBookingStatus(booking._id, "Cancelled")
                            }
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm block text-center">
                          Finished
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
