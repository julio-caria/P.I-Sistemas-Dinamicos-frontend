
import { apiFetch } from "./api";

export type Student = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  secondaryPhone?: string | null;
  address: string;
  registrationNumber: string;
  admissionDate: string;
  birthDate?: string | null;
  gender?: string | null;
  nationality?: string | null;
  naturalness?: string | null;
  photoUrl?: string | null;
  emergencyContact?: string | null;
  status?: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateStudentData = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  admissionDate: string;
  birthDate: string;
  gender?: string;
  nationality?: string;
  naturalness?: string;
  photoUrl?: string;
  emergencyContact: string;
  status?: string;
};

export async function getStudents(): Promise<Student[]> {
  const response = await apiFetch("/api/v1/students");

  if (!response.ok) {
    throw new Error("Erro ao buscar alunos.");
  }

  const data: { students: Student[] } = await response.json();

  return data.students;
}

export async function getStudentById(id: string): Promise<Student> {
  const response = await apiFetch(`/api/v1/students/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar aluno.");
  }

  const data: { student: Student } = await response.json();

  return data.student;
}

export async function createStudent(student: CreateStudentData) {
  const response = await apiFetch("/api/v1/students", {
    method: "POST",
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar aluno.");
  }

  return response.json() as Promise<{
    studentId: string;
    registrationNumber: string;
  }>;
}

export async function deleteStudent(id: string) {
  const response = await apiFetch(`/api/v1/students/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir aluno.");
  }

  return response.json() as Promise<{
    message: string;
  }>;
}
