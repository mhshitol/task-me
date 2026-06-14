import { Header } from "@/components/layout/Header";
import { getUser } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id } }),
  ]);

  const total       = tasks.length;
  const done        = tasks.filter((t) => t.status === "DONE").length;
  const inProgress  = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo        = tasks.filter((t) => t.status === "TODO").length;
  const pct         = total > 0 ? Math.round((done / total) * 100) : 0;
  const overdue     = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;

  const dbName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  const STATS = [
    { label: "Total Tasks",   value: total,      icon: ListTodo,     color: "text-brand-500",   bg: "bg-brand-50" },
    { label: "Completed",     value: done,        icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "In Progress",   value: inProgress,  icon: Clock,        color: "text-amber-500",   bg: "bg-amber-50" },
    { label: "To Do",         value: todo,        icon: Circle,       color: "text-neutral-400", bg: "bg-neutral-50" },
  ];

  // Circumference for progress ring
  const r   = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Dashboard" subtitle={`Welcome back, ${dbName} 👋`} />

      <main className="flex-1 p-6 space-y-6 max-w-5xl w-full mx-auto">

        {/* Progress + stats row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Progress ring */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r={r}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dash}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-neutral-900">
                {pct}%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Overall Progress</p>
              <p className="text-xs text-neutral-400 mt-0.5">{done} of {total} tasks done</p>
              {overdue > 0 && (
                <p className="text-xs text-red-500 font-medium mt-2">{overdue} overdue</p>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="md:col-span-3 grid grid-cols-2 gap-4">
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories overview */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Categories</h2>
            <div className="space-y-3">
              {categories.map((cat) => {
                const catTasks   = tasks.filter((t) => t.categoryId === cat.id);
                const catDone    = catTasks.filter((t) => t.status === "DONE").length;
                const catTotal   = catTasks.length;
                const catPct     = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-neutral-700">{cat.name}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{catDone}/{catTotal}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${catPct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent tasks */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Recent Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">No tasks yet — create your first one!</p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {tasks.slice(0, 8).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    task.status === "DONE"        ? "bg-emerald-400" :
                    task.status === "IN_PROGRESS" ? "bg-amber-400"   : "bg-neutral-300"
                  }`} />
                  <span className={`text-sm flex-1 truncate ${task.status === "DONE" ? "line-through text-neutral-400" : "text-neutral-700"}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    task.priority === "HIGH"   ? "bg-red-50 text-red-500"     :
                    task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600" : "bg-neutral-100 text-neutral-400"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
