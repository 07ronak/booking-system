// src/app/api/drivers/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const drivers = await db.collection("drivers").find({}).toArray();

    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, carDetails } = body;

    if (!name || !carDetails) {
      return NextResponse.json(
        { success: false, error: "Name and car details are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("drivers").insertOne({
      name,
      carDetails,
      availability: "Available",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        name,
        carDetails,
        availability: "Available",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
