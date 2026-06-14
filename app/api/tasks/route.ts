import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { createTaskSchema } from "@/lib/validations/task.schema";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const status     = searchParams.get("status");
    const priority   = searchParams.get("priority");

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        ...(categoryId && { categoryId }),
        ...(status    && { status:   status   as any }),
        ...(priority  && { priority: priority as any }),
      },
      include: { category: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: tasks, error: null, message: "OK" });
  } catch (err) {
    console.error("[GET /api/tasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const body   = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0].message, message: "" }, { status: 400 });
    }

    // Get max position for the user
    const maxPos = await prisma.task.aggregate({
      where: { userId: user.id },
      _max: { position: true },
    });

    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        userId:   user.id,
        position: (maxPos._max.position ?? 0) + 1,
        dueDate:  parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: task, error: null, message: "Task created" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}
