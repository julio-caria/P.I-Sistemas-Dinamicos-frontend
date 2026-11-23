import { apiFetch } from "./api";

export type Gender = "male" | "female" | "other" | "not_informed";

export type StudentStatus =
  | "active"
  | "on_leave"
  | "graduated"
  | "withdrawn"
  | "dismissed";

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
  gender?: Gender | null;
  nationality?: string | null;
  naturalness?: string | null;
  photoUrl?: string | null;
  emergencyContact?: string | null;
  status?: StudentStatus;
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
  gender?: Gender;
  nationality?: string;
  naturalness?: string;
  photoUrl?: string;
  emergencyContact: string;
  status?: StudentStatus;
};

export type UpdateStudentData = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  secondaryPhone?: string | null;
  address: string;
  registrationNumber: string;
  admissionDate: string;
  birthDate?: string | null;
  gender?: Gender | null;
  nationality?: string | null;
  naturalness?: string | null;
  photoUrl?: string | null;
  emergencyContact?: string | null;
  status?: StudentStatus;
};

type StudentsResponse = {
  students: Student[];
};

type StudentResponse = {
  student: Student;
};

type CreateStudentResponse = {
  studentId: string;
  registrationNumber: string;
};

type MessageResponse = {
  message: string;
};

async function getErrorMessage(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const data = (await response.json()) as MessageResponse;

    if (data.message) {
      return data.message;
    }
  } catch {
    // A resposta pode não conter JSON.
  }

  return defaultMessage;
}

export async function getStudents(): Promise<Student[]> {
  const response = await apiFetch("/api/v1/students");

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao buscar alunos."));
  }

  const data = (await response.json()) as StudentsResponse;

  return data.students;
}

export async function getStudentById(id: string): Promise<Student> {
  const response = await apiFetch(`/api/v1/students/${id}`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao buscar aluno."));
  }

  const data = (await response.json()) as StudentResponse;

  return data.student;
}

export async function createStudent(
  student: CreateStudentData,
): Promise<CreateStudentResponse> {
  const response = await apiFetch("/api/v1/students", {
    method: "POST",
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Erro ao cadastrar aluno."),
    );
  }

  return (await response.json()) as CreateStudentResponse;
}

export async function updateStudent(
  id: string,
  student: UpdateStudentData,
): Promise<MessageResponse> {
  const response = await apiFetch(`/api/v1/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Erro ao atualizar aluno."),
    );
  }

  return (await response.json()) as MessageResponse;
}

export async function deleteStudent(id: string): Promise<MessageResponse> {
  const response = await apiFetch(`/api/v1/students/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao excluir aluno."));
  }

  return (await response.json()) as MessageResponse;
}
