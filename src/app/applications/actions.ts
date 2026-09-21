"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateApplicationStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!/^[0-9a-f-]{36}$/i.test(id) || !["unread", "read"].includes(status)) return;

  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/applications");
}

export async function deleteApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!/^[0-9a-f-]{36}$/i.test(id)) return;

  await prisma.application.delete({ where: { id } });
  revalidatePath("/applications");
}
