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

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  status: "Ativo" | "Inativo";
};

type CargoUsuario = {
  id: number;
  nome: string;
};

const roles: CargoUsuario[] = [
  { id: 1, nome: "Administrador" },
  { id: 2, nome: "Secretaria" },
  { id: 3, nome: "Financeiro" },
  { id: 4, nome: "Coordenacao" },
];

const NOVO_USUARIO_INICIAL = {
  nome: "",
  email: "",
  role: "",
};

export default function Usuarios(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "REGISTRO",
      email: "registro@email.com",
      role: "Secretaria",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "REGISTRO",
      email: "registro123@email.com",
      role: "Secretaria",
      status: "Ativo",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState(NOVO_USUARIO_INICIAL);

  function handleAddUser() {
    const novo: Usuario = {
      id: Date.now(),
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role,
      status: "Ativo",
    };

    setUsuarios((prev) => [...prev, novo]);
    setNovoUsuario(NOVO_USUARIO_INICIAL);
    setOpenAdd(false);
  }

  function handleEditUser() {
    if (!selectedUser) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? selectedUser : u)),
    );
    setOpenEdit(false);
  }

  function handleDeleteUser() {
    if (!selectedUser) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setOpenDelete(false);
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Usuários</h2>

        {/* BOTÃO ADICIONAR */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115"
          >
            <Plus size={18} />
            <span>Cadastrar Usuário</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold">Nome</TableHead>
              <TableHead className="text-zinc-800 font-bold">E-mail</TableHead>
              <TableHead className="text-zinc-800 font-bold">Role</TableHead>
              <TableHead className="text-zinc-800 font-bold">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.role}</TableCell>
                <TableCell>{usuario.status}</TableCell>
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
                          setSelectedUser(usuario);
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
                          setSelectedUser(usuario);
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
            values={novoUsuario}
            onChange={(field, value) =>
              setNovoUsuario((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Cadastrar</Button>
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

          {selectedUser && (
            <UsuarioFormFields
              values={{
                nome: selectedUser.nome,
                email: selectedUser.email,
                role: selectedUser.role,
              }}
              onChange={(field, value) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
          </DialogHeader>

          <p>Deseja realmente excluir este usuário?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type UserFormValues = {
  nome: string;
  email: string;
  role: string;
};

function UsuarioFormFields({
  values,
  onChange,
}: {
  values: UserFormValues;
  onChange: (field: keyof UserFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="teacherName">Nome do Usuario</FieldLabel>
        <Input
          id="teacherName"
          autoComplete="off"
          placeholder="John Doe"
          required
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          autoComplete="off"
          type="email"
          placeholder="usuario@email.com"
          value={values.email}
          required
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="roles">Role</FieldLabel>
        <Select
          value={values.role}
          onValueChange={(value) => onChange("role", value)}
          required
        >
          <SelectTrigger id="roles">
            <SelectValue placeholder="Selecione um título" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.nome}>
                  {role.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
