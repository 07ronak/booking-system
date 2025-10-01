// src/app/api/drivers/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { availability } = body;

    if (!availability || !["Available", "Unavailable"].includes(availability)) {
      return NextResponse.json(
        { success: false, error: "Valid availability status is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("drivers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          availability,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
