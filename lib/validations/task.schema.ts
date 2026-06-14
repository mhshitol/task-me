import { z } from "zod";

export const createTaskSchema = z.object({
  title:       z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  priority:    z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status:      z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  dueDate:     z.string().datetime().optional().nullable(),
  categoryId:  z.string().uuid().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
