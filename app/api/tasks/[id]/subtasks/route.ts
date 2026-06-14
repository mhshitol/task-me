export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { z } from "zod";

const createSubtaskSchema = z.object({
  title: z.string().min(1).max(255),
});

const updateSubtaskSchema = z.object({
  title:      z.string().min(1).max(255).optional(),
  isComplete: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const task = await prisma.task.findFirst({ where: { id: params.id, userId: user.id } });
    if (!task) return NextResponse.json({ data: null, error: "Not found", message: "" }, { status: 404 });

    const subtasks = await prisma.subtask.findMany({
      where:   { taskId: params.id },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ data: subtasks, error: null, message: "OK" });
  } catch (err) {
    console.error("[GET subtasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const task = await prisma.task.findFirst({ where: { id: params.id, userId: user.id } });
    if (!task) return NextResponse.json({ data: null, error: "Not found", message: "" }, { status: 404 });

    const body   = await req.json();
    const parsed = createSubtaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0].message, message: "" }, { status: 400 });
    }

    const maxPos = await prisma.subtask.aggregate({
      where: { taskId: params.id },
      _max:  { position: true },
    });

    const subtask = await prisma.subtask.create({
      data: {
        title:    parsed.data.title,
        taskId:   params.id,
        position: (maxPos._max.position ?? 0) + 1,
      },
    });

    return NextResponse.json({ data: subtask, error: null, message: "Subtask created" }, { status: 201 });
  } catch (err) {
    console.error("[POST subtasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const body = await req.json();
    const { subtaskId, ...data } = body;
    if (!subtaskId) return NextResponse.json({ data: null, error: "subtaskId required", message: "" }, { status: 400 });

    const parsed = updateSubtaskSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0].message, message: "" }, { status: 400 });
    }

    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data:  parsed.data,
    });

    return NextResponse.json({ data: subtask, error: null, message: "Subtask updated" });
  } catch (err) {
    console.error("[PATCH subtasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const subtaskId = new URL(req.url).searchParams.get("subtaskId");
    if (!subtaskId) return NextResponse.json({ data: null, error: "subtaskId required", message: "" }, { status: 400 });

    await prisma.subtask.delete({ where: { id: subtaskId } });

    return NextResponse.json({ data: null, error: null, message: "Subtask deleted" });
  } catch (err) {
    console.error("[DELETE subtasks]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}