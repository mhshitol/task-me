import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { z } from "zod";

const reorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ data: null, error: "Unauthorized", message: "" }, { status: 401 });

    const body   = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: "Invalid body", message: "" }, { status: 400 });
    }

    const { orderedIds } = parsed.data;

    // Verify all tasks belong to this user
    const tasks = await prisma.task.findMany({
      where: { id: { in: orderedIds }, userId: user.id },
      select: { id: true },
    });

    if (tasks.length !== orderedIds.length) {
      return NextResponse.json({ data: null, error: "Invalid task IDs", message: "" }, { status: 403 });
    }

    // Update positions in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.task.update({
          where: { id },
          data:  { position: index },
        })
      )
    );

    return NextResponse.json({ data: null, error: null, message: "Reordered" });
  } catch (err) {
    console.error("[PATCH /api/tasks/reorder]", err);
    return NextResponse.json({ data: null, error: "Server error", message: "" }, { status: 500 });
  }
}
