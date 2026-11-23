
import { apiFetch } from "./api";

export type DegreeLevel =
  | "undergraduate"
  | "specialization"
  | "master"
  | "doctorate";

export type Teacher = {
  id: string;
  name: string;
  cpf: string;
  rg: string | null;
  email: string;
  phone: string;
  address: string;
  employeeNumber: string;
  degreeLevel: DegreeLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeacherData = {
  name: string;
  cpf: string;
  rg?: string | null;
  email: string;
  phone: string;
  address: string;
  employeeNumber: string;
  degreeLevel: DegreeLevel;
  isActive?: boolean;
};

export async function getTeachers(): Promise<Teacher[]> {
  const response = await apiFetch("/api/v1/teachers");

  if (!response.ok) {
    throw new Error("Erro ao buscar docentes.");
  }

  return response.json();
}

export async function getTeacherById(id: string): Promise<Teacher> {
  const response = await apiFetch(`/api/v1/teachers/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar docente.");
  }

  return response.json();
}

export async function createTeacher(data: TeacherData) {
  const response = await apiFetch("/api/v1/teachers", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar docente.");
  }

  return response.json();
}

export async function updateTeacher(
  id: string,
  data: TeacherData,
) {
  const response = await apiFetch(`/api/v1/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar docente.");
  }

  return response.json();
}

export async function deleteTeacher(id: string) {
  const response = await apiFetch(`/api/v1/teachers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir docente.");
  }

  return response.json();
}
