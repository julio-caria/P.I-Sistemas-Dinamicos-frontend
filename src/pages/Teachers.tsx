import { useEffect, useState } from "react";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateTeacher,
  type Teacher,
} from "@/services/teacherService";
import { MoreHorizontalIcon, Pencil, Plus, Trash } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/utils/toast";

type TeacherRow = {
  id: string | number;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  endereco: string;
  matriculaFuncional: string;
  titulacao: Teacher["degreeLevel"] | "";
  status: "Ativo" | "Inativo";
};

type Titulacao = {
  id: number;
  value: Teacher["degreeLevel"];
  nome: string;
};

const titulacoes: Titulacao[] = [
  { id: 1, value: "undergraduate", nome: "Graduação" },
  { id: 2, value: "specialization", nome: "Especialização" },
  { id: 3, value: "master", nome: "Mestrado" },
  { id: 4, value: "doctorate", nome: "Doutorado" },
];

const NEW_TEACHER_INITIAL: TeacherFormValues = {
  nome: "",
  cpf: "",
  rg: "",
  email: "",
  telefone: "",
  endereco: "",
  matriculaFuncional: "",
  titulacao: "",
};

function getDegreeLevelLabel(degreeLevel: Teacher["degreeLevel"]) {
  const labels: Record<Teacher["degreeLevel"], string> = {
    undergraduate: "Graduação",
    specialization: "Especialização",
    master: "Mestrado",
    doctorate: "Doutorado",
  };

  return labels[degreeLevel];
}

export default function Teachers(): JSX.Element {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTeachers() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getTeachers();

        if (!cancelled) {
          setTeachers(
            data.map((teacher) => ({
              id: teacher.id,
              nome: teacher.name,
              cpf: teacher.cpf,
              rg: teacher.rg ?? "",
              email: teacher.email,
              telefone: teacher.phone,
              endereco: teacher.address,
              matriculaFuncional: teacher.employeeNumber,
              titulacao: teacher.degreeLevel,
              status: teacher.isActive ? "Ativo" : "Inativo",
            })),
          );
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Erro ao carregar docentes.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTeachers();

    return () => {
      cancelled = true;
    };
  }, []);

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRow | null>(
    null,
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [newTeacher, setNewTeacher] =
    useState<TeacherFormValues>(NEW_TEACHER_INITIAL);
  async function handleAddTeacher() {
    try {
      await createTeacher({
        name: newTeacher.nome,
        cpf: newTeacher.cpf.replace(/\D/g, ""),
        rg: newTeacher.rg || null,
        email: newTeacher.email,
        phone: newTeacher.telefone,
        address: newTeacher.endereco,
        employeeNumber: newTeacher.matriculaFuncional,
        degreeLevel: newTeacher.titulacao as Teacher["degreeLevel"],
      });

      showToast.success(
        "Docente registrado",
        "Registro de Docente inserido com sucesso",
      );

      const data = await getTeachers();

      setTeachers(
        data.map((teacher) => ({
          id: teacher.id,
          nome: teacher.name,
          cpf: teacher.cpf,
          rg: teacher.rg ?? "",
          email: teacher.email,
          telefone: teacher.phone,
          endereco: teacher.address,
          matriculaFuncional: teacher.employeeNumber,
          titulacao: teacher.degreeLevel,
          status: teacher.isActive ? "Ativo" : "Inativo",
        })),
      );

      setNewTeacher(NEW_TEACHER_INITIAL);
      setOpenAdd(false);
    } catch (error) {
      showToast.error(
        "Erro ao cadastrar docente",
        `Não foi possível cadastrar o docente, ${error}`,
      );
    }
  }

  async function handleEditTeacher() {
    if (!selectedTeacher) return;

    try {
      await updateTeacher(String(selectedTeacher.id), {
        name: selectedTeacher.nome,
        cpf: selectedTeacher.cpf.replace(/\D/g, ""),
        rg: selectedTeacher.rg || null,
        email: selectedTeacher.email,
        phone: selectedTeacher.telefone,
        address: selectedTeacher.endereco,
        employeeNumber: selectedTeacher.matriculaFuncional,
        degreeLevel: selectedTeacher.titulacao as Teacher["degreeLevel"],
        isActive: selectedTeacher.status === "Ativo",
      });
      showToast.success(
        "Docente atualizado",
        "Informações do docente atualizadas",
      );

      const data = await getTeachers();

      setTeachers(
        data.map((teacher) => ({
          id: teacher.id,
          nome: teacher.name,
          cpf: teacher.cpf,
          rg: teacher.rg ?? "",
          email: teacher.email,
          telefone: teacher.phone,
          endereco: teacher.address,
          matriculaFuncional: teacher.employeeNumber,
          titulacao: teacher.degreeLevel,
          status: teacher.isActive ? "Ativo" : "Inativo",
        })),
      );

      setOpenEdit(false);
      setSelectedTeacher(null);
    } catch (error) {
      showToast.error(
        "Erro ao atualizar docente",
        `Não foi possível atualizar o docente, ${error}`,
      );
    }
  }

  async function handleDeleteTeacher() {
    if (!selectedTeacher) return;

    try {
      await deleteTeacher(String(selectedTeacher.id));
      showToast.success(
        "Docente desativado",
        "Registro de Docente desativado com sucesso",
      );

      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, status: "Inativo" }
            : teacher,
        ),
      );

      setOpenDelete(false);
      setSelectedTeacher(null);
    } catch (error) {
      showToast.error(
        "Erro ao desativar docente",
        `Não foi possível desativar o docente, ${error}`,
      );
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Docentes</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115
                       dark:bg-[#242424] dark:hover:bg-[#303030]
                       dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Cadastrar Docente</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Nome
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                CPF
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                E-mail
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Endereço
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Matricula Funcional
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Titulação
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Carregando docentes...
                </TableCell>
              </TableRow>
            ) : loadError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500">
                  {loadError}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nenhum docente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  className="dark:border-zinc-700 dark:hover:bg-[#303030]"
                >
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.nome}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.cpf}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.email}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.endereco}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.matriculaFuncional}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.titulacao
                      ? getDegreeLevelLabel(teacher.titulacao)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-zinc-800 dark:text-white">
                    {teacher.status}
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
                            setSelectedTeacher(teacher);
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
                            setSelectedTeacher(teacher);
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
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Cadastrar Docente
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os campos para cadastrar um docente.
            </DialogDescription>
          </DialogHeader>

          <TeacherFormFields
            values={newTeacher}
            onChange={(field, value) =>
              setNewTeacher((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]"
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTeacher}>Cadastrar</Button>
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

          {selectedTeacher && (
            <TeacherFormFields
              values={{
                nome: selectedTeacher.nome,
                cpf: selectedTeacher.cpf,
                rg: selectedTeacher.rg,
                email: selectedTeacher.email,
                telefone: selectedTeacher.telefone,
                endereco: selectedTeacher.endereco,
                matriculaFuncional: selectedTeacher.matriculaFuncional,
                titulacao: selectedTeacher.titulacao,
              }}
              onChange={(field, value) =>
                setSelectedTeacher((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]"
            >
              Cancelar
            </Button>
            <Button onClick={handleEditTeacher}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Registro</DialogTitle>
          </DialogHeader>

          <p className="text-zinc-800 dark:text-white">
            Deseja realmente excluir este registro?
          </p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type TeacherFormValues = {
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  endereco: string;
  matriculaFuncional: string;
  titulacao: Teacher["degreeLevel"] | "";
};

function TeacherFormFields({
  values,
  onChange,
}: {
  values: TeacherFormValues;
  onChange: <K extends keyof TeacherFormValues>(
    field: K,
    value: TeacherFormValues[K],
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="teacherName">
          Nome do Docente
        </FieldLabel>
        <Input
          id="teacherName"
          autoComplete="off"
          placeholder="John Doe"
          required
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="cpf">
          CPF
        </FieldLabel>
        <Input
          id="cpf"
          autoComplete="off"
          placeholder="123.456.789-00"
          value={values.cpf}
          required
          maxLength={14}
          onChange={(e) => onChange("cpf", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="rg">
          RG
        </FieldLabel>
        <Input
          id="rg"
          autoComplete="off"
          placeholder="12.345.678-9"
          value={values.rg}
          onChange={(e) => onChange("rg", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
               dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">
          E-mail
        </FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="off"
          required
          placeholder="docente@email.com"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="phone">
          Telefone
        </FieldLabel>
        <Input
          id="phone"
          type="tel"
          autoComplete="off"
          placeholder="(11) 99999-9999"
          required
          value={values.telefone}
          onChange={(e) => onChange("telefone", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
               dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="address">
          Endereço
        </FieldLabel>
        <Input
          id="address"
          autoComplete="off"
          placeholder="Av. Nações Unidas, Santo Amaro, SP"
          value={values.endereco}
          required
          onChange={(e) => onChange("endereco", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="functionEnrollment">
          Matrícula Funcional
        </FieldLabel>
        <Input
          id="functionEnrollment"
          autoComplete="off"
          placeholder="123456789"
          value={values.matriculaFuncional}
          required
          onChange={(e) => onChange("matriculaFuncional", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="titration">
          Titulação
        </FieldLabel>
        <Select
          value={values.titulacao}
          onValueChange={(value) =>
            onChange("titulacao", value as TeacherFormValues["titulacao"])
          }
          required
        >
          <SelectTrigger id="titration">
            <SelectValue placeholder="Selecione um título" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {titulacoes.map((titulacao) => (
                <SelectItem key={titulacao.id} value={titulacao.value}>
                  {titulacao.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
