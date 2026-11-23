import { useEffect, useState } from "react";
import { Pencil, Plus, MoreHorizontalIcon, Trash } from "lucide-react";
import type { JSX } from "react";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
  type CreateSupplierData,
  type UpdateSupplierData,
} from "@/services/supplierService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { showToast } from "@/utils/toast";

type SupplierFormValues = {
  legalName: string;
  cnpj: string;
  stateRegistration: string;
  email: string;
  address: string;
  category: string;
  phone: string;
  isActive: boolean;
};

const NOVO_FORNECEDOR_INICIAL: SupplierFormValues = {
  legalName: "",
  cnpj: "",
  stateRegistration: "",
  email: "",
  address: "",
  category: "",
  isActive: true,
  phone: "",
};

const categorias = [
  { id: 1, nome: "Serviço" },
  { id: 2, nome: "Produto" },
];

function supplierToForm(supplier: Supplier): SupplierFormValues {
  return {
    legalName: supplier.legalName ?? "",
    cnpj: supplier.cnpj ?? "",
    stateRegistration: supplier.stateRegistration ?? "",
    email: supplier.email ?? "",
    address: supplier.address ?? "",
    category: supplier.category ?? "",
    phone: supplier.phone ?? "",
    isActive: supplier.isActive,
  };
}

export default function Fornecedores(): JSX.Element {
  const [fornecedores, setFornecedores] = useState<Supplier[]>([]);

  const [selectedFornecedor, setSelectedFornecedor] = useState<Supplier | null>(
    null,
  );

  const [novoFornecedor, setNovoFornecedor] = useState<SupplierFormValues>({
    ...NOVO_FORNECEDOR_INICIAL,
  });

  const [formEdicao, setFormEdicao] = useState<SupplierFormValues>({
    ...NOVO_FORNECEDOR_INICIAL,
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function loadSuppliers() {
    try {
      const data = await getSuppliers();

      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchSuppliers() {
      try {
        const data = await getSuppliers();

        if (!ignore) {
          setFornecedores(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Erro ao carregar fornecedores:", error);
        }
      }
    }

    fetchSuppliers();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddFornecedor() {
    try {
      setLoadingAdd(true);

      const dadosFornecedor: CreateSupplierData = {
        legalName: novoFornecedor.legalName.trim(),
        cnpj: novoFornecedor.cnpj.replace(/\D/g, ""),
        stateRegistration: novoFornecedor.stateRegistration.trim() || null,
        email: novoFornecedor.email.trim(),
        address: novoFornecedor.address.trim(),
        category: novoFornecedor.category,
        phone: novoFornecedor.phone.trim(),
        isActive: novoFornecedor.isActive,
      };

      await createSupplier(dadosFornecedor);
      showToast.success(
        "Fornecedor cadastrado",
        "Registro de Fornecedor inserido com sucesso",
      );

      await loadSuppliers();

      setNovoFornecedor({
        ...NOVO_FORNECEDOR_INICIAL,
      });

      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      showToast.error(
        "Erro ao cadastrar fornecedor",
        "Não foi possível cadastrar o fornecedor. Verifique os dados.",
      );
    } finally {
      setLoadingAdd(false);
    }
  }

  async function handleOpenEditSupplier(id: string) {
    try {
      setLoadingEdit(true);
      setSelectedFornecedor(null);

      setOpenEdit(true);

      const supplier = await getSupplierById(id);

      setSelectedFornecedor(supplier);

      setFormEdicao(supplierToForm(supplier));
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error);
      showToast.error(
        "Erro ao carregar fornecedor",
        "Não foi possível carregar os dados do fornecedor.",
      );

      setOpenEdit(false);
    } finally {
      setLoadingEdit(false);
    }
  }

  async function handleEditSupplier() {
    if (!selectedFornecedor) return;

    try {
      setLoadingSave(true);

      const dadosAtualizados: UpdateSupplierData = {
        legalName: formEdicao.legalName.trim(),
        cnpj: formEdicao.cnpj.replace(/\D/g, ""),
        stateRegistration: formEdicao.stateRegistration.trim() || null,
        email: formEdicao.email.trim(),
        address: formEdicao.address.trim(),
        category: formEdicao.category,
        phone: formEdicao.phone.trim(),
        isActive: formEdicao.isActive,
      };

      await updateSupplier(selectedFornecedor.id, dadosAtualizados);
      showToast.success(
        "Dados atualizados",
        "Registro de fornecedor atualizado com sucesso",
      );

      await loadSuppliers();

      setSelectedFornecedor(null);

      setOpenEdit(false);
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      showToast.success(
        "Erro ao atualizar fornecedor",
        "Não foi possível atualizar o fornecedor.",
      );
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleDeleteFornecedor() {
    if (!selectedFornecedor) return;

    try {
      setLoadingDelete(true);

      await deleteSupplier(selectedFornecedor.id);
      showToast.success(
        "Fornecedor desativado",
        "Registro de fornecedor desativado com sucesso",
      );

      await loadSuppliers();

      setSelectedFornecedor(null);

      setOpenDelete(false);
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      showToast.error(
        "Erro ao excluir fornecedor",
        "Não foi possível excluir o fornecedor.",
      );
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Fornecedores
        </h2>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115
              dark:bg-[#242424] dark:hover:bg-[#303030]
              dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />

            <span>Cadastrar Fornecedor</span>
          </Button>
        </div>

        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Razão Social
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                CNPJ
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Inscrição Estadual
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Endereço
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Categoria
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Telefone
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Status
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fornecedores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-zinc-500 dark:text-zinc-400"
                >
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              fornecedores.map((fornecedor) => (
                <TableRow
                  key={fornecedor.id}
                  className="dark:border-zinc-700 dark:hover:bg-[#303030]"
                >
                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.legalName}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.cnpj}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.stateRegistration || "Não informado"}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.address}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.category}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.phone}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {fornecedor.isActive === true ? "Ativo" : "Inativo"}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 dark:text-white dark:hover:bg-[#383838]"
                        >
                          <MoreHorizontalIcon />

                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenEditSupplier(fornecedor.id)}
                        >
                          <Pencil size={12} />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setSelectedFornecedor(fornecedor);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash size={12} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Cadastrar Fornecedor
            </DialogTitle>

            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os campos para cadastrar um fornecedor.
            </DialogDescription>
          </DialogHeader>

          <SupplierFormFields
            values={novoFornecedor}
            onChange={(field, value) =>
              setNovoFornecedor(
                (prev) =>
                  ({
                    ...prev,
                    [field]: value,
                  }) as SupplierFormValues,
              )
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              disabled={loadingAdd}
              className="dark:bg-[#303030] dark:text-white dark:border-[#363636]"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleAddFornecedor}
              disabled={loadingAdd}
              className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636]"
            >
              {loadingAdd ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);

          if (!open) {
            setSelectedFornecedor(null);
          }
        }}
      >
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Editar Fornecedor
            </DialogTitle>

            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Altere os campos desejados e salve.
            </DialogDescription>
          </DialogHeader>

          {loadingEdit ? (
            <div className="flex justify-center py-8 text-zinc-500">
              Carregando dados do fornecedor...
            </div>
          ) : selectedFornecedor ? (
            <SupplierFormFields
              values={formEdicao}
              onChange={(field, value) =>
                setFormEdicao(
                  (prev) =>
                    ({
                      ...prev,
                      [field]: value,
                    }) as SupplierFormValues,
                )
              }
            />
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              disabled={loadingEdit || loadingSave}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleEditSupplier}
              disabled={loadingEdit || loadingSave || !selectedFornecedor}
              className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636]"
            >
              {loadingSave ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);

          if (!open) {
            setSelectedFornecedor(null);
          }
        }}
      >
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Excluir Fornecedor
            </DialogTitle>
          </DialogHeader>

          <p className="text-zinc-800 dark:text-white">
            Deseja realmente excluir este fornecedor?
          </p>

          {selectedFornecedor && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {selectedFornecedor.legalName}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={loadingDelete}
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteFornecedor}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SupplierFormFields({
  values,
  onChange,
}: {
  values: SupplierFormValues;
  onChange: (field: keyof SupplierFormValues, value: string | boolean) => void;
}) {
  return (
    <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
      {/* LEGAL NAME */}
      <Field>
        <FieldLabel htmlFor="legalName">Razão Social</FieldLabel>
        <Input
          id="legalName"
          placeholder="Nome da empresa"
          required
          value={values.legalName}
          maxLength={200}
          onChange={(e) => onChange("legalName", e.target.value)}
        />
      </Field>

      {/* CNPJ */}
      <Field>
        <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
        <Input
          id="cnpj"
          placeholder="00.000.000/0000-00"
          required
          maxLength={18}
          value={values.cnpj}
          onChange={(e) => onChange("cnpj", e.target.value)}
        />
      </Field>

      {/* STATE REGISTRATION */}
      <Field>
        <FieldLabel htmlFor="stateRegistration">Inscrição Estadual</FieldLabel>
        <Input
          id="stateRegistration"
          placeholder="Inscrição Estadual"
          maxLength={30}
          value={values.stateRegistration}
          onChange={(e) => onChange("stateRegistration", e.target.value)}
        />
      </Field>

      {/* EMAIL */}
      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="empresa@email.com"
          required
          maxLength={120}
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>

      {/* ADDRESS */}
      <Field>
        <FieldLabel htmlFor="address">Endereço</FieldLabel>
        <Input
          id="address"
          placeholder="Endereço completo"
          required
          maxLength={255}
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </Field>

      {/* PHONE */}
      <Field>
        <FieldLabel htmlFor="phone">Telefone</FieldLabel>
        <Input
          id="phone"
          placeholder="(11) 1234-5678"
          required
          maxLength={20}
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </Field>

      {/* CATEGORY */}
      <Field>
        <FieldLabel htmlFor="category">Categoria</FieldLabel>
        <Select
          value={values.category}
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.nome}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* STATUS */}
      <Field>
        <FieldLabel htmlFor="isActive">Status do Fornecedor</FieldLabel>
        <Select
          value={String(values.isActive)}
          onValueChange={(value) => onChange("isActive", value === "true")}
        >
          <SelectTrigger id="isActive">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
