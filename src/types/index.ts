// src/types/index.ts
export interface Driver {
  _id: string;
  name: string;
  carDetails: string;
  availability: "Available" | "Unavailable";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  _id: string;
  customerName: string;
  pickupLocation: string;
  dropLocation: string;
  driverId: string;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
