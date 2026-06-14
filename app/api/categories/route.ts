export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { createCategorySchema } from "@/lib/validations/category.schema";

export async function GET(_req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const categories = await prisma.category.findMany({
      where:   { userId: user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: categories, error: null, message: "OK" });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const body   = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0].message, message: "" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { ...parsed.data, userId: user.id },
    });

    return NextResponse.json({ data: category, error: null, message: "Category created" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}