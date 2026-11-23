import { useEffect, useState } from "react"; import {
  Pencil,
  Plus,
  MoreHorizontalIcon,
  Trash,
} from "lucide-react";
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
  type Supplier,
  type CreateSupplierData,
} from "@/services/supplierService";
import type { JSX } from "react";
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


const NOVO_FORNECEDOR_INICIAL = {
  legalName: "",
  cnpj: "",
  stateRegistration: "",
  email: "",
  address: "",
  category: "",
  phone: "",
};

type Categoria = {
  id: number;
  nome: string;
};

const categorias: Categoria[] = [
  { id: 1, nome: "Serviço" },
  { id: 2, nome: "Produto" },
];

export default function Fornecedores(): JSX.Element {
  const [fornecedores, setFornecedores] = useState<Supplier[]>([]);

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const data = await getSuppliers();
        setFornecedores(data);
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
      }
    }

    loadSuppliers();
  }, []);

  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Supplier | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoFornecedor, setNovoFornecedor] = useState(NOVO_FORNECEDOR_INICIAL);

  async function handleAddFornecedor() {
    try {
      const dadosFornecedor: CreateSupplierData = {
        legalName: novoFornecedor.legalName,
        cnpj: novoFornecedor.cnpj.replace(/\D/g, ""),
        stateRegistration: novoFornecedor.stateRegistration || null,
        email: novoFornecedor.email,
        address: novoFornecedor.address,
        category: novoFornecedor.category,
        phone: novoFornecedor.phone,
      };

      await createSupplier(dadosFornecedor);

      const fornecedoresAtualizados = await getSuppliers();
      setFornecedores(fornecedoresAtualizados);

      setNovoFornecedor(NOVO_FORNECEDOR_INICIAL);
      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      alert("Não foi possível cadastrar o fornecedor. Verifique os dados.");
    }
  }

  function handleEditSupplier() {
    if (!selectedFornecedor) return;
    setFornecedores((prev) =>
      prev.map((s) =>
        s.id === selectedFornecedor.id ? selectedFornecedor : s,
      ),
    );
    setOpenEdit(false);
  }

  async function handleDeleteFornecedor() {
    if (!selectedFornecedor) return;

    try {
      await deleteSupplier(selectedFornecedor.id);

      const fornecedoresAtualizados = await getSuppliers();
      setFornecedores(fornecedoresAtualizados);

      setSelectedFornecedor(null);
      setOpenDelete(false);
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      alert("Não foi possível excluir o fornecedor.");
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Fornecedores</h2>

        {/* BOTÃO ADICIONAR */}
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

        {/* TABELA */}
        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow >
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Razão Social
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">CNPJ</TableHead>
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
              <TableHead className="text-zinc-800 font-bold dark:text-white">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fornecedores.map((fornecedor) => (
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
                  {fornecedor.isActive ? "Ativo" : "Inativo"}
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
                        onClick={() => {
                          setSelectedFornecedor(fornecedor);
                          setOpenEdit(true);
                        }}
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
            ))}
          </TableBody>

        </Table>
      </main>

      {/* ── MODAL ADICIONAR ── */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Cadastrar Usuário</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os campos para cadastrar um usuario.
            </DialogDescription>
          </DialogHeader>

          <UsuarioFormFields
            values={novoFornecedor}
            onChange={(field, value) =>
              setNovoFornecedor((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)} className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]">
              Cancelar
            </Button>
            <Button onClick={handleAddFornecedor} className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]">Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL EDITAR ── */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Editar Registro</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Altere os campos desejados e salve.
            </DialogDescription>
          </DialogHeader>

          {selectedFornecedor && (
            <UsuarioFormFields
              values={{
                razaoSocial: selectedFornecedor.razaoSocial,
                cnpj: selectedFornecedor.cnpj,
                inscricaoEstadual: selectedFornecedor.inscricaoEstadual,
                endereco: selectedFornecedor.endereco,
                categoria: selectedFornecedor.categoria,
                telefone: selectedFornecedor.telefone,
              }}
              onChange={(field, value) =>
                setSelectedFornecedor((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSupplier} className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]">Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Excluir Fornecedor</DialogTitle>
          </DialogHeader>

          <p className="text-zinc-800 dark:text-white">Deseja realmente excluir este fornecedor?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteFornecedor}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}

type SupplierFormValues = {
  legalName: string;
  cnpj: string;
  stateRegistration: string;
  email: string;
  address: string;
  category: string;
  phone: string;
};

function UsuarioFormFields({
  values,
  onChange,
}: {
  values: SupplierFormValues;
  onChange: (field: keyof SupplierFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="legalName">Razão Social</FieldLabel>
        <Input
          id="legalName"
          placeholder="Nome da empresa"
          required
          value={values.legalName}
          onChange={(e) => onChange("legalName", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
        <Input
          id="cnpj"
          placeholder="00.000.000/0000-00"
          required
          value={values.cnpj}
          onChange={(e) => onChange("cnpj", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="stateRegistration">
          Inscrição Estadual
        </FieldLabel>
        <Input
          id="stateRegistration"
          placeholder="Inscrição Estadual"
          value={values.stateRegistration}
          onChange={(e) => onChange("stateRegistration", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="empresa@email.com"
          required
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="address">Endereço</FieldLabel>
        <Input
          id="address"
          placeholder="Endereço completo"
          required
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Telefone</FieldLabel>
        <Input
          id="phone"
          placeholder="(11) 1234-5678"
          required
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </Field>

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
    </div>
  );
}