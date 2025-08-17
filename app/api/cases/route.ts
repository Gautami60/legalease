import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url || "", "http://localhost:3000");
    const caseId = searchParams.get("id");

    let cases;
    if (caseId) {
      cases = await Case.findOne({ _id: caseId, user: session.user.id });
    } else {
      cases = await Case.find({ user: session.user.id });
    }

    return NextResponse.json(cases, { status: 200 });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const newCase = new Case({ ...body, user: session.user.id });
    await newCase.save();

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
