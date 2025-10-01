import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db.command({ ping: 1 });
    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
