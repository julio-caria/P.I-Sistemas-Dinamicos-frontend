import { apiFetch } from "./api";

export type Supplier = {
  id: string;
  legalName: string;
  cnpj: string;
  stateRegistration: string | null;
  email: string;
  phone: string;
  address: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplierData = {
  legalName: string;
  cnpj: string;
  stateRegistration?: string | null;
  email: string;
  phone: string;
  address: string;
  category: string;
};

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiFetch("/api/v1/suppliers");

  if (response.status === 404) return [];

  if (!response.ok) {
    throw new Error("Erro ao buscar fornecedores.");
  }

  const data: { suppliers: Supplier[] } = await response.json();

  return data.suppliers;
}

export async function createSupplier(
  supplier: CreateSupplierData,
): Promise<void> {
  const response = await apiFetch("/api/v1/suppliers", {
    method: "POST",
    body: JSON.stringify(supplier),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar fornecedor.");
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  const response = await apiFetch(`/api/v1/suppliers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir fornecedor.");
  }
}