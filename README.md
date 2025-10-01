# Booking System - Full Stack Project

A fully responsive booking system built with Next.js, TypeScript, Tailwind CSS, and MongoDB Atlas.

## Features

- **Driver Management**: Add drivers, view all drivers with car details, and toggle availability status
- **Driver Availability**: Set drivers as available or unavailable with real-time status updates
- **Booking Management**: Create bookings with customer info, pickup/drop locations, and assigned drivers
- **Status Updates**: Complete or cancel bookings with instant status updates
- **Real-time Updates**: Dynamic UI that reflects changes immediately
- **Fully Responsive**: Mobile-first design that works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── drivers/
│   │   └── page.tsx               # Driver management page
│   ├── bookings/
│   │   └── page.tsx               # Booking management page
│   └── api/
│       ├── test/
│       │   └── route.ts           # Test API route
│       ├── drivers/
│       │   ├── route.ts           # Drivers CRUD API
│       │   └── [id]/
│       │       └── route.ts       # Update driver availability
│       └── bookings/
│           └── route.ts           # Bookings CRUD API
├── lib/
│   └── mongodb.ts                 # MongoDB connection helper
└── types/
    └── index.ts                   # TypeScript type definitions
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account or sign in
3. Create a new cluster (free tier is sufficient). Name the cluster anything as you like.
4. Pick AWS (it’s the default, stable, and free tier). Doesn’t matter much though. 
5. Turn ON "Automate Security Setup". Turn OFF "Preload Sample Dataset"
6. Click Sumbit/Next
7. Click "Create Database User"
8. Click "Choose a connection method" and Select "Connect your application (the top one)"
9. Copy the connection string

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory: (already present)

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your MongoDB credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=booking_system
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas credentials.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Connection

Visit [http://localhost:3000/api/test](http://localhost:3000/api/test) to verify MongoDB connection.

## Usage

### Adding Drivers

1. Navigate to **Driver Management** from the home page
2. Fill in the driver's name and car details (e.g., "Toyota Camry - ABC123")
3. Click "Add Driver"
4. The driver will appear in the list below with "Available" status by default

### Managing Driver Availability

1. In the drivers list, find the driver you want to update
2. Click "Set Unavailable" to mark them as unavailable, or "Set Available" to mark them as available
3. The status badge will update in real-time

### Creating Bookings

1. Navigate to **Booking Management** from the home page
2. Fill in:
   - Customer name
   - Pickup location
   - Drop location
   - Select an assigned driver from the dropdown
3. Click "Create Booking"
4. The booking will appear in the table with "Pending" status

### Managing Booking Status

1. In the bookings table, find a booking with "Pending" status
2. Click "Complete" to mark it as completed, or "Cancel" to cancel the booking
3. Once updated, the action buttons will change to "Finished"
4. Status badges will update accordingly (green for Completed, red for Cancelled)

## API Endpoints

### Drivers API (`/api/drivers`)

- **GET**: Fetch all drivers
- **POST**: Create a new driver
  ```json
  {
    "name": "John Doe",
    "carDetails": "Toyota Camry - ABC123"
  }
  ```

### Driver Availability API (`/api/drivers/[id]`)

- **PATCH**: Update driver availability
  ```json
  {
    "availability": "Available" | "Unavailable"
  }
  ```

### Bookings API (`/api/bookings`)

- **GET**: Fetch all bookings
- **POST**: Create a new booking
  ```json
  {
    "customerName": "Jane Smith",
    "pickupLocation": "Airport",
    "dropLocation": "Hotel",
    "driverId": "driver_id_here"
  }
  ```
- **PATCH**: Update booking status
  ```json
  {
    "bookingId": "booking_id_here",
    "status": "Completed" | "Cancelled"
  }
  ```

## Database Collections

### drivers

```javascript
{
  _id: ObjectId,
  name: string,
  carDetails: string,
  availability: "Available" | "Unavailable",
  createdAt: Date,
  updatedAt: Date
}
```

### bookings

```javascript
{
  _id: ObjectId,
  customerName: string,
  pickupLocation: string,
  dropLocation: string,
  driverId: ObjectId,
  status: "Pending" | "Completed" | "Cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

## Responsive Design

The application is fully responsive with:

- **Mobile View**: Card-based layouts for better readability on small screens
- **Tablet View**: Optimized spacing and layout for medium-sized devices
- **Desktop View**: Full table views and expanded layouts for large screens

All pages adapt seamlessly to different screen sizes using Tailwind CSS responsive utilities.

## Future Enhancements

- Only show available drivers in booking form
- Predefined pickup/drop locations (Jaipur and nearby area)
- Add a status filter for bookings (Pending/Completed/Cancelled)
- Add search and sort options in driver and booking tables
- Auto-refresh booking and driver lists for real-time updates (Fetching the latest data from the backend API every few seconds)

## License

Ronak Hingonia
