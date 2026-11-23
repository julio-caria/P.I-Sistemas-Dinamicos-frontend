import { apiFetch } from "./api";

export type UserRole = "admin" | "secretary" | "finance" | "coordination";

export type Usuario = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  personalEmail: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NovoUsuario = {
  firstName: string;
  lastName: string;
  personalEmail: string;
};

export type AtualizarUsuario = Partial<{
  firstName: string;
  lastName: string;
  personalEmail: string;
  role: UserRole;
  isActive: boolean;
}>;

export type UsuarioCriado = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  mustChangePassword: boolean;
  temporaryPassword: string;
};

// Listar todos os usuários
export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await apiFetch("/api/v1/users");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao listar usuários.");
  }

  return data;
}

// Buscar usuário pelo ID
export async function buscarUsuarioPorId(id: string): Promise<Usuario> {
  const response = await apiFetch(`/api/v1/users/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao buscar usuário.");
  }

  return data;
}

// Cadastrar novo usuário
export async function cadastrarUsuario(
  usuario: NovoUsuario,
): Promise<UsuarioCriado> {
  const response = await apiFetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(usuario),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao cadastrar usuário.");
  }

  return data;
}

// Atualizar usuário (parcial)
export async function atualizarUsuario(
  id: string,
  usuario: AtualizarUsuario,
): Promise<void> {
  const response = await apiFetch(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message || "Não foi possível atualizar o usuário.");
  }
}

export async function excluirUsuario(id: string): Promise<void> {
  const response = await apiFetch(`/api/v1/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message || "Não foi possível excluir o usuário.");
  }
}
