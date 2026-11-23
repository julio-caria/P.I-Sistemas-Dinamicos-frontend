import { apiFetch } from "./api";

export type Course = {
  id: string;
  name: string;
  workloadHours: number;
  durationSemesters: number;
  modality: "in_person" | "online" | "hybrid";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getCourses(): Promise<Course[]> {
  const response = await apiFetch("/api/v1/courses");

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar cursos.");
  }

  const data: { courses: Course[] } = await response.json();

  return data.courses;
}

type CreateCourseData = {
  name: string;
  workloadHours: number;
  durationSemesters: number;
  modality: "in_person" | "online" | "hybrid";
};

export async function createCourse(course: CreateCourseData) {
  const response = await apiFetch("/api/v1/courses", {
    method: "POST",
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar curso.");
  }

  return response.json();
}

type UpdateCourseData = Partial<{
  name: string;
  workloadHours: number;
  durationSemesters: number;
  modality: "in_person" | "online" | "hybrid";
  isActive: boolean;
}>;

export async function updateCourse(id: string, course: UpdateCourseData) {
  const response = await apiFetch(`/api/v1/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar curso.");
  }

  return response.json();
}

export async function deleteCourse(id: string) {
  const response = await apiFetch(`/api/v1/courses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir curso.");
  }

  return response.json();
}
