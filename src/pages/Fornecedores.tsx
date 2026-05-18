import { useState } from "react";
import {
  Pencil,
  Plus,
  MoreHorizontalIcon,
  Trash,
} from "lucide-react";
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

type Fornecedor = {
  id: number;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  categoria: string;
  telefone: string;
  status: "Ativo" | "Inativo";
};

const NOVO_FORNECEDOR_INICIAL = {
  razaoSocial: "",
  cnpj: "",
  inscricaoEstadual: "",
  endereco: "",
  categoria: "",
  telefone: "",
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
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: 1,
      razaoSocial: "Tech Solutions",
      cnpj: "01.000.000/0001-30",
      inscricaoEstadual: "",
      endereco: "Av. Nações Unidas, Santo Amaro - SP",
      categoria: "Serviço",
      telefone: "(11) 99999-9999",
      status: "Ativo",
    },
    {
      id: 2,
      razaoSocial: "Office Paper",
      cnpj: "01.000.000/0001-31",
      inscricaoEstadual: "",
      endereco: "Av. Nações Unidas, Santo Amaro - SP",
      categoria: "Serviço",
      telefone: "(11) 98888-8888",
      status: "Ativo",
    },
  ]);

  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Fornecedor | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoFornecedor, setNovoFornecedor] = useState(NOVO_FORNECEDOR_INICIAL);

  function handleAddFornecedor() {
    const novo: Fornecedor = {
      id: Date.now(),
      razaoSocial: novoFornecedor.razaoSocial,
      cnpj: novoFornecedor.cnpj,
      inscricaoEstadual: novoFornecedor.inscricaoEstadual,
      endereco: novoFornecedor.endereco,
      categoria: novoFornecedor.categoria,
      telefone: novoFornecedor.telefone,
      status: "Ativo",
    };

    setFornecedores((prev) => [...prev, novo]);
    setNovoFornecedor(NOVO_FORNECEDOR_INICIAL);
    setOpenAdd(false);
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

  function handleDeleteFornecedor() {
    if (!selectedFornecedor) return;
    setFornecedores((prev) =>
      prev.filter((f) => f.id !== selectedFornecedor.id),
    );
    setOpenDelete(false);
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Fornecedores</h2>

        {/* BOTÃO ADICIONAR */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115"
          >
            <Plus size={18} />
            <span>Cadastrar Fornecedor</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold">
                Razão Social
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">CNPJ</TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Inscrição Estadual
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Endereço
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Categoria
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Telefone
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedores.map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell>{fornecedor.razaoSocial}</TableCell>
                <TableCell>{fornecedor.cnpj}</TableCell>
                <TableCell>{fornecedor.inscricaoEstadual}</TableCell>
                <TableCell>{fornecedor.endereco}</TableCell>
                <TableCell>{fornecedor.categoria}</TableCell>
                <TableCell>{fornecedor.telefone}</TableCell>
                <TableCell>{fornecedor.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Usuário</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
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
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFornecedor}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL EDITAR ── */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
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
            <Button onClick={handleEditSupplier}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Fornecedor</DialogTitle>
          </DialogHeader>

          <p>Deseja realmente excluir este fornecedor?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteFornecedor}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type SupplierFormValues = {
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  categoria: string;
  telefone: string;
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
        <FieldLabel htmlFor="razaoSocial">Razão Social</FieldLabel>
        <Input
          id="razaoSocial"
          autoComplete="off"
          placeholder="Senac"
          required
          value={values.razaoSocial}
          onChange={(e) => onChange("razaoSocial", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
        <Input
          id="cnpj"
          autoComplete="off"
          placeholder="00.000.000/0000-00"
          value={values.cnpj}
          required
          onChange={(e) => onChange("cnpj", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="ie">Inscrição Estadual</FieldLabel>
        <Input
          id="ie"
          autoComplete="off"
          placeholder="00000"
          maxLength={5}
          value={values.inscricaoEstadual}
          required
          onChange={(e) => onChange("inscricaoEstadual", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="address">Endereço</FieldLabel>
        <Input
          id="address"
          autoComplete="off"
          placeholder="Av. Nações Unidas - Santo Amaro - SP"
          value={values.endereco}
          required
          onChange={(e) => onChange("endereco", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Telefone</FieldLabel>
        <Input
          id="phone"
          autoComplete="off"
          placeholder="(11) 1234-5678"
          value={values.telefone}
          required
          onChange={(e) => onChange("telefone", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="categorias">Categoria</FieldLabel>
        <Select
          value={values.categoria}
          onValueChange={(value) => onChange("categoria", value)}
          required
        >
          <SelectTrigger id="categorias">
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
