
import { apiFetch } from "./api";


export type Class = {
  id: string;
  courseId: string;
  teacherId: string | null;
  description: string;
  semester: "1" | "2";
  year: number;
  scheduleTime: string;
  room: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassData = {
  courseId: string;
  teacherId?: string | null;
  description: string;
  semester: "1" | "2";
  year: number;
  scheduleTime: string;
  room: string;
  status?: Class["status"];
  isActive?: boolean;
};

export async function getClasses(): Promise<Class[]> {
  const response = await apiFetch("/api/v1/classes");

  if (!response.ok) {
    throw new Error("Erro ao buscar turmas.");
  }

  return response.json();
}

export async function getClassById(id: string): Promise<Class> {
  const response = await apiFetch(`/api/v1/classes/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar turma.");
  }

  return response.json();
}

export async function createClass(classData: CreateClassData) {
  const response = await apiFetch("/api/v1/classes", {
    method: "POST",
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar turma.");
  }

  return response.json() as Promise<{
    id: string;
    message: string;
  }>;
}

export async function updateClass(
  id: string,
  classData: CreateClassData,
) {
  const response = await apiFetch(`/api/v1/classes/${id}`, {
    method: "PUT",
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar turma.");
  }

  return response.json();
}

export async function deleteClass(id: string) {
  const response = await apiFetch(`/api/v1/classes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir turma.");
  }

  return response.json();
}
