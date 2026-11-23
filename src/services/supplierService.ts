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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplierData = {
  legalName: string;
  cnpj: string;
  stateRegistration: string | null;
  email: string;
  phone: string;
  address: string;
  category: string;
  isActive: boolean;
};

export type UpdateSupplierData = CreateSupplierData;

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiFetch("/api/v1/suppliers");

  if (!response.ok) {
    throw new Error("Erro ao buscar fornecedores.");
  }

  const data: { suppliers: Supplier[] } = await response.json();

  return data.suppliers;
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const response = await apiFetch(`/api/v1/suppliers/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar fornecedor.");
  }

  const data: { supplier: Supplier } = await response.json();

  return data.supplier;
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

export async function updateSupplier(
  id: string,
  supplier: UpdateSupplierData,
): Promise<void> {
  const response = await apiFetch(`/api/v1/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(supplier),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar fornecedor.");
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