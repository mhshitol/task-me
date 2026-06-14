import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { updateTaskSchema } from "@/lib/validations/task.schema";

async function getOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({ where: { id: taskId, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const task = await prisma.task.findFirst({
      where: { id: params.id, userId: user.id },
      include: { category: true },
    });
    if (!task) return NextResponse.json({ data: null, error: "Not found", message: "" }, { status: 404 });

    return NextResponse.json({ data: task, error: null, message: "OK" });
  } catch (err) {
    console.error("[GET /api/tasks/:id]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const owned = await getOwnedTask(params.id, user.id);
    if (!owned) return NextResponse.json({ data: null, error: "Not found", message: "" }, { status: 404 });

    const body   = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0].message, message: "" }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : parsed.data.dueDate,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: task, error: null, message: "Task updated" });
  } catch (err) {
    console.error("[PATCH /api/tasks/:id]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const owned = await getOwnedTask(params.id, user.id);
    if (!owned) return NextResponse.json({ data: null, error: "Not found", message: "" }, { status: 404 });

    await prisma.task.delete({ where: { id: params.id } });

    return NextResponse.json({ data: null, error: null, message: "Task deleted" });
  } catch (err) {
    console.error("[DELETE /api/tasks/:id]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}
