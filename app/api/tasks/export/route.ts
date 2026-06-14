import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";

function escapeCSV(val: string | null | undefined): string {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(_req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where:   { userId: user.id },
      include: { category: true, subtasks: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    const headers = [
      "Title", "Description", "Status", "Priority",
      "Category", "Due Date", "Subtasks Total",
      "Subtasks Done", "Created At",
    ];

    const rows = tasks.map((t) => {
      const subtasksDone = t.subtasks.filter((s) => s.isComplete).length;
      return [
        escapeCSV(t.title),
        escapeCSV(t.description),
        escapeCSV(t.status),
        escapeCSV(t.priority),
        escapeCSV(t.category?.name),
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
        String(t.subtasks.length),
        String(subtasksDone),
        new Date(t.createdAt).toLocaleDateString(),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type":        "text/csv",
        "Content-Disposition": `attachment; filename="taskme-export-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/tasks/export]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
