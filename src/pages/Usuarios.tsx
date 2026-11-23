import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  MoreHorizontalIcon,
  Trash,
  Search,
  RotateCcw,
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
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "@/services/userService";
import type { Usuario as UsuarioApi, UserRole } from "@/services/userService";
import { showToast } from "@/utils/toast";

type Usuario = {
  id: string;
  firstName: string;
  lastName: string;
  nome: string;
  email: string;
  emailPessoal: string;
  role: string;
  status: "Ativo" | "Inativo";
};

type CargoUsuario = {
  id: number;
  value: UserRole;
  nome: string;
};

// "value" é o valor aceito pela API (enum user_role); "nome" é o texto exibido na tela
const roles: CargoUsuario[] = [
  { id: 1, value: "admin", nome: "Administrador" },
  { id: 2, value: "secretary", nome: "Secretaria" },
  { id: 3, value: "finance", nome: "Financeiro" },
  { id: 4, value: "coordination", nome: "Coordenação" },
];

function getRoleLabel(value: string): string {
  return roles.find((role) => role.value === value)?.nome ?? value;
}

const NOVO_USUARIO_INICIAL = {
  firstName: "",
  lastName: "",
  personalEmail: "",
};

// Converte o usuário retornado pela API para o formato usado na tela
function formatUsuario(usuario: UsuarioApi): Usuario {
  return {
    id: usuario.id,
    firstName: usuario.firstName,
    lastName: usuario.lastName,
    nome: usuario.name || `${usuario.firstName} ${usuario.lastName}`,
    email: usuario.email,
    emailPessoal: usuario.personalEmail,
    role: usuario.role,
    status: usuario.isActive ? "Ativo" : "Inativo",
  };
}

type UserFormValues = {
  firstName: string;
  lastName: string;
  emailPessoal: string;
  role: string;
};

// Mantido FORA do componente Usuarios: se fosse declarado dentro, seria recriado
// a cada render e os inputs perderiam o foco a cada tecla digitada.
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
        <FieldLabel htmlFor="editFirstName">Nome</FieldLabel>
        <Input
          id="editFirstName"
          autoComplete="off"
          placeholder="Carlos"
          required
          value={values.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="editLastName">Sobrenome</FieldLabel>
        <Input
          id="editLastName"
          autoComplete="off"
          placeholder="Oliveira"
          required
          value={values.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="editPersonalEmail">E-mail pessoal</FieldLabel>
        <Input
          id="editPersonalEmail"
          autoComplete="off"
          type="email"
          placeholder="usuario@email.com"
          value={values.emailPessoal}
          required
          onChange={(e) => onChange("emailPessoal", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="editRole">Cargo</FieldLabel>
        <Select
          value={values.role}
          onValueChange={(value) => onChange("role", value)}
          required
        >
          <SelectTrigger id="editRole">
            <SelectValue placeholder="Selecione um cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.value}>
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

export default function Usuarios(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [cadastrando, setCadastrando] = useState(false);
  const [erroCadastro, setErroCadastro] = useState("");
  const [senhaTemporaria, setSenhaTemporaria] = useState("");
  const [emailInstitucional, setEmailInstitucional] = useState("");
  const [atualizando, setAtualizando] = useState(false);
  const [erroAtualizacao, setErroAtualizacao] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");
  const [busca, setBusca] = useState("");
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return (
      usuario.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
      usuario.email.toLocaleLowerCase("pt-BR").includes(termo) ||
      usuario.emailPessoal?.toLocaleLowerCase("pt-BR").includes(termo)
    );
  });

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await listarUsuarios();
        setUsuarios(dados.map(formatUsuario));
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os usuários.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, []);

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState(NOVO_USUARIO_INICIAL);

  async function handleAddUser() {
    if (
      !novoUsuario.firstName.trim() ||
      !novoUsuario.lastName.trim() ||
      !novoUsuario.personalEmail.trim()
    ) {
      setErroCadastro("Preencha todos os campos.");
      showToast.warning("Campos não preenchidos", `Preencha todos os campos`);
      return;
    }

    try {
      setCadastrando(true);
      setErroCadastro("");

      const resultado = await cadastrarUsuario({
        firstName: novoUsuario.firstName.trim(),
        lastName: novoUsuario.lastName.trim(),
        personalEmail: novoUsuario.personalEmail.trim(),
      });

      showToast.success(
        "Usuário cadastrado",
        "Registro de usuário inserido com sucesso",
      );

      // Armazena os dados retornados pelo cadastro.
      setSenhaTemporaria(resultado.temporaryPassword);
      setEmailInstitucional(resultado.email);

      // Atualiza a listagem sem comprometer o resultado do cadastro.
      try {
        const dados = await listarUsuarios();
        setUsuarios(dados.map(formatUsuario));
      } catch {
        // O cadastro foi concluído mesmo se a atualização falhar.
        showToast.warning(
          "Cadastro realizado",
          `Não foi possível atualizar a listagem.`,
        );
        setErro(
          "Cadastro realizado, mas não foi possível atualizar a listagem.",
        );
      }
    } catch (error) {
      showToast.error(
        "Falha no cadastro",
        `Não foi possível cadastrar o usuário`,
      );
      setErroCadastro(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o usuário.",
      );
    } finally {
      setCadastrando(false);
    }
  }

  async function handleEditUser() {
    if (!selectedUser) return;

    if (
      !selectedUser.firstName.trim() ||
      !selectedUser.lastName.trim() ||
      !selectedUser.emailPessoal.trim() ||
      !selectedUser.role
    ) {
      setErroAtualizacao("Preencha todos os campos.");
      showToast.warning("Campos não preenchidos", "Preencha todos os campos");
      return;
    }

    try {
      setAtualizando(true);
      setErroAtualizacao("");

      await atualizarUsuario(selectedUser.id, {
        firstName: selectedUser.firstName.trim(),
        lastName: selectedUser.lastName.trim(),
        personalEmail: selectedUser.emailPessoal.trim(),
        role: selectedUser.role as UserRole,
      });

      showToast.success("Usuário atualizado", "Alterações salvas com sucesso");

      // Recarrega a listagem a partir do backend.
      try {
        const dados = await listarUsuarios();
        setUsuarios(dados.map(formatUsuario));
      } catch {
        // A atualização foi concluída mesmo se o recarregamento falhar.
        showToast.warning(
          "Usuário atualizado",
          "Não foi possível atualizar a listagem.",
        );
      }

      setOpenEdit(false);
      setSelectedUser(null);
    } catch (error) {
      showToast.error(
        "Erro ao atualizar usuário",
        "Não foi possível salvar as alterações.",
      );
      setErroAtualizacao(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o usuário.",
      );
    } finally {
      setAtualizando(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;

    try {
      setExcluindo(true);
      setErroExclusao("");

      await excluirUsuario(selectedUser.id);
      showToast.success("Usuário desativado", `Registro de usuário desativado`);

      // Atualiza o status do usuário após confirmação do backend.
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === selectedUser.id
            ? { ...usuario, status: "Inativo" }
            : usuario,
        ),
      );

      setOpenDelete(false);
      setSelectedUser(null);
    } catch (error) {
      showToast.error(
        "Erro ao desativar registro",
        `Não foi possível excluir o usuário.`,
      );
      setErroExclusao(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o usuário.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Usuários
        </h2>

        {/* BUSCA E BOTÃO ADICIONAR */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setBusca("")}
              disabled={!busca}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => {
              setNovoUsuario(NOVO_USUARIO_INICIAL);
              setErroCadastro("");
              setSenhaTemporaria("");
              setEmailInstitucional("");
              setOpenAdd(true);
            }}
            className="bg-blue-900 cursor-pointer hover:brightness-115
               dark:bg-[#242424] dark:hover:bg-[#303030]
               dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Cadastrar Usuário</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Nome
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                E-mail
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Cargo
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Status
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {carregando ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : erro ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-red-500 py-6"
                >
                  {erro}
                </TableCell>
              </TableRow>
            ) : usuariosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  {busca
                    ? "Nenhum usuário corresponde à busca."
                    : "Nenhum usuário cadastrado."}
                </TableCell>
              </TableRow>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <TableRow
                  key={usuario.id}
                  className="dark:border-zinc-700 dark:hover:bg-[#303030]"
                >
                  <TableCell className="text-zinc-800 dark:text-white">
                    {usuario.nome}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {usuario.email}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {getRoleLabel(usuario.role)}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {usuario.status}
                  </TableCell>
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
                            setErroAtualizacao("");
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
              ))
            )}
          </TableBody>
        </Table>
      </main>

      {/* ── MODAL ADICIONAR ── */}
      <Dialog
        open={openAdd}
        onOpenChange={(open) => {
          if (!cadastrando) {
            setOpenAdd(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {senhaTemporaria ? "Usuário cadastrado!" : "Cadastrar Usuário"}
            </DialogTitle>

            <DialogDescription className="text-sm text-zinc-500">
              {senhaTemporaria
                ? "O cadastro foi realizado com sucesso. Guarde a senha temporária."
                : "Preencha os campos para cadastrar um usuário."}
            </DialogDescription>
          </DialogHeader>

          {senhaTemporaria ? (
            <div className="space-y-3">
              <Field>
                <FieldLabel>E-mail institucional</FieldLabel>
                <Input value={emailInstitucional} readOnly />
              </Field>

              <Field>
                <FieldLabel>Senha temporária</FieldLabel>
                <Input type="text" value={senhaTemporaria} readOnly />
              </Field>

              <p className="text-sm text-amber-600">
                Guarde essa senha. O usuário deverá alterá-la no primeiro
                acesso.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                <Input
                  id="firstName"
                  placeholder="Carlos"
                  value={novoUsuario.firstName}
                  onChange={(e) =>
                    setNovoUsuario((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
                <Input
                  id="lastName"
                  placeholder="Oliveira"
                  value={novoUsuario.lastName}
                  onChange={(e) =>
                    setNovoUsuario((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="personalEmail">E-mail pessoal</FieldLabel>
                <Input
                  id="personalEmail"
                  type="email"
                  placeholder="usuario@email.com"
                  value={novoUsuario.personalEmail}
                  onChange={(e) =>
                    setNovoUsuario((prev) => ({
                      ...prev,
                      personalEmail: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          )}

          {erroCadastro && (
            <p className="text-sm text-red-500">{erroCadastro}</p>
          )}

          <DialogFooter>
            {senhaTemporaria ? (
              <Button
                onClick={() => {
                  setOpenAdd(false);
                  setNovoUsuario(NOVO_USUARIO_INICIAL);
                  setSenhaTemporaria("");
                  setEmailInstitucional("");
                  setErroCadastro("");
                }}
              >
                Concluir
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setOpenAdd(false)}
                  disabled={cadastrando}
                >
                  Cancelar
                </Button>

                <Button onClick={handleAddUser} disabled={cadastrando}>
                  {cadastrando ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL EDITAR ── */}
      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          if (!atualizando) {
            setOpenEdit(open);
            if (!open) setErroAtualizacao("");
          }
        }}
      >
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
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                emailPessoal: selectedUser.emailPessoal,
                role: selectedUser.role,
              }}
              onChange={(field, value) =>
                setSelectedUser((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          {erroAtualizacao && (
            <p className="text-sm text-red-500">{erroAtualizacao}</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              disabled={atualizando}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={atualizando}>
              {atualizando ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog
        open={openDelete}
        onOpenChange={(open) => {
          if (!excluindo) {
            setOpenDelete(open);
            if (!open) setErroExclusao("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Deseja realmente inativar este usuário? Essa ação não apagará o
              registro do banco de dados.
            </DialogDescription>
          </DialogHeader>

          {erroExclusao && (
            <p className="text-sm text-red-500">{erroExclusao}</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={excluindo}
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={excluindo}
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
