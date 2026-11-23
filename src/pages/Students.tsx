import { useEffect, useState } from "react";
import type { JSX } from "react";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  type Student,
  type StudentStatus,
  type Gender,
  type CreateStudentData,
  type UpdateStudentData,
} from "@/services/studentService";
import { Pencil, Plus, MoreHorizontalIcon, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Aluno = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  dtMatricula: string;
  status: string;
};

type AlunoFormValues = {
  nome: string;
  cpf: string;
  email: string;
  dtMatricula: string;
  telefone: string;
  telefoneSecundario: string;
  endereco: string;
  dtNascimento: string;
  genero: string;
  nacionalidade: string;
  naturalidade: string;
  fotoUrl: string;
  contatoEmergencia: string;
  status: StudentStatus;
};


const GENEROS: {
  value: Gender;
  label: string;
}[] = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "other", label: "Outro" },
  { value: "not_informed", label: "Não informado" },
];

const STATUS_ALUNO: {
  value: StudentStatus;
  label: string;
}[] = [
  { value: "active", label: "Ativo" },
  { value: "on_leave", label: "Afastado" },
  { value: "graduated", label: "Formado" },
  { value: "withdrawn", label: "Desistente" },
  { value: "dismissed", label: "Desligado" },
];


const NOVO_ALUNO_INICIAL: AlunoFormValues = {
  nome: "",
  cpf: "",
  email: "",
  dtMatricula: "",
  telefone: "",
  telefoneSecundario: "",
  endereco: "",
  dtNascimento: "",
  genero: "",
  nacionalidade: "",
  naturalidade: "",
  fotoUrl: "",
  contatoEmergencia: "",
  status: "active",
};

function formatarData(data: string) {
  if (!data) return "—";

  const dataFormatada = data.slice(0, 10);
  const [ano, mes, dia] = dataFormatada.split("-");

  if (!ano || !mes || !dia) return "—";

  return `${dia}/${mes}/${ano}`;
}

function formatarStatus(status?: string, isActive?: boolean) {
  if (!status) {
    return isActive ? "Ativo" : "Inativo";
  }
  const statusEncontrado = STATUS_ALUNO.find((item) => item.value === status);
  return statusEncontrado?.label ?? status;
}

function converterDataParaISO(data: string): string {
  if (!data) {
    throw new Error("A data de matrícula é obrigatória.");
  }
  return new Date(`${data}T00:00:00.000Z`).toISOString();
}

function converterAlunoParaTabela(student: Student): Aluno {
  return {
    id: student.id,
    nome: student.name,
    cpf: student.cpf,
    email: student.email,
    dtMatricula: student.admissionDate,
    status: formatarStatus(student.status, student.isActive),
  };
}

function converterStudentParaFormulario(student: Student): AlunoFormValues {
  return {
    nome: student.name,
    cpf: student.cpf,
    email: student.email,
    dtMatricula: student.admissionDate.slice(0, 10),
    telefone: student.phone,
    telefoneSecundario: student.secondaryPhone ?? "",
    endereco: student.address,
    dtNascimento: student.birthDate?.slice(0, 10) ?? "",
    genero: student.gender ?? "",
    nacionalidade: student.nationality ?? "",
    naturalidade: student.naturalness ?? "",
    fotoUrl: student.photoUrl ?? "",
    contatoEmergencia: student.emergencyContact ?? "",
    status: student.status ?? "active",
  };
}

// COMPONENTE PRINCIPAL
export default function Alunos(): JSX.Element {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const [studentEditando, setStudentEditando] = useState<Student | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoAluno, setNovoAluno] = useState<AlunoFormValues>({
    ...NOVO_ALUNO_INICIAL,
  });

  const [alunoEmEdicao, setAlunoEmEdicao] = useState<AlunoFormValues>({
    ...NOVO_ALUNO_INICIAL,
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarAlunos() {
    try {
      setLoading(true);
      setErro("");

      const students = await getStudents();

      const alunosFormatados = students.map(converterAlunoParaTabela);

      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os alunos.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  async function handleAddAluno() {
    try {
      setErro("");

      if (
        !novoAluno.nome.trim() ||
        !novoAluno.cpf.trim() ||
        !novoAluno.email.trim() ||
        !novoAluno.telefone.trim() ||
        !novoAluno.endereco.trim() ||
        !novoAluno.dtMatricula ||
        !novoAluno.dtNascimento ||
        !novoAluno.contatoEmergencia.trim()
      ) {
        setErro("Preencha todos os campos obrigatórios.");
        showToast.warning(
          "Campos não preenchidos",
          "Preencha todos os campos obrigatórios.",
        );

        return;
      }

      setLoading(true);

      const studentData: CreateStudentData = {
        name: novoAluno.nome.trim(),
        cpf: novoAluno.cpf.replace(/\D/g, ""),
        email: novoAluno.email.trim().toLowerCase(),
        phone: novoAluno.telefone.trim(),
        address: novoAluno.endereco.trim(),
        admissionDate: converterDataParaISO(novoAluno.dtMatricula),
        birthDate: novoAluno.dtNascimento,
        emergencyContact: novoAluno.contatoEmergencia.trim(),
        status: novoAluno.status,
      };

      if (novoAluno.telefoneSecundario.trim()) {
        studentData.secondaryPhone = novoAluno.telefoneSecundario.trim();
      }

      if (novoAluno.genero) {
        studentData.gender = novoAluno.genero as Gender;
      }

      if (novoAluno.nacionalidade.trim()) {
        studentData.nationality = novoAluno.nacionalidade.trim();
      }

      if (novoAluno.naturalidade.trim()) {
        studentData.naturalness = novoAluno.naturalidade.trim();
      }

      if (novoAluno.fotoUrl.trim()) {
        studentData.photoUrl = novoAluno.fotoUrl.trim();
      }

      await createStudent(studentData);
      showToast.success(
        "Aluno registrado",
        "Novo aluno cadastrado com sucesso",
      );

      await carregarAlunos();

      setNovoAluno({ ...NOVO_ALUNO_INICIAL });

      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      showToast.error(
        "Erro ao cadastrar aluno",
        "Não foi possível cadastrar o aluno.",
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o aluno.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ABRIR EDIÇÃO
  async function handleOpenEdit(aluno: Aluno) {
    try {
      setErro("");
      setLoading(true);

      const student = await getStudentById(aluno.id);

      setStudentEditando(student);

      setAlunoEmEdicao(converterStudentParaFormulario(student));

      setSelectedAluno(aluno);

      setOpenEdit(true);
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      showToast.error(
        "Erro ao buscar aluno",
        "Não foi possível pesquisar o aluno.",
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados do aluno.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------
  // ATUALIZAR ALUNO
  // ---------------------------------------------------

  async function handleEditAluno() {
    if (!studentEditando) return;

    try {
      setErro("");

      if (
        !alunoEmEdicao.nome.trim() ||
        !alunoEmEdicao.cpf.trim() ||
        !alunoEmEdicao.email.trim() ||
        !alunoEmEdicao.telefone.trim() ||
        !alunoEmEdicao.endereco.trim() ||
        !alunoEmEdicao.dtMatricula
      ) {
        setErro("Preencha todos os campos obrigatórios.");

        return;
      }

      setLoading(true);

      const studentData: UpdateStudentData = {
        name: alunoEmEdicao.nome.trim(),
        cpf: alunoEmEdicao.cpf.replace(/\D/g, ""),
        email: alunoEmEdicao.email.trim().toLowerCase(),
        phone: alunoEmEdicao.telefone.trim(),
        address: alunoEmEdicao.endereco.trim(),
        // Preserva o número de matrícula gerado pelo backend.
        registrationNumber: studentEditando.registrationNumber,
        admissionDate: converterDataParaISO(alunoEmEdicao.dtMatricula),
        status: alunoEmEdicao.status,
        secondaryPhone: alunoEmEdicao.telefoneSecundario.trim() || null,
        birthDate: alunoEmEdicao.dtNascimento || null,
        gender: (alunoEmEdicao.genero as Gender) || null,
        nationality: alunoEmEdicao.nacionalidade.trim() || null,
        naturalness: alunoEmEdicao.naturalidade.trim() || null,
        photoUrl: alunoEmEdicao.fotoUrl.trim() || null,
        emergencyContact: alunoEmEdicao.contatoEmergencia.trim() || null,
      };

      await updateStudent(studentEditando.id, studentData);
      showToast.success(
        "Aluno atualizado",
        "Registro de Aluno atualizado com sucesso",
      );

      await carregarAlunos();

      setOpenEdit(false);
      setSelectedAluno(null);
      setStudentEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      showToast.error(
        "Erro ao atualizado aluno",
        "Não foi possível atualizar o aluno.",
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o aluno.",
      );
    } finally {
      setLoading(false);
    }
  }

  // EXCLUIR / DESATIVAR ALUNO
  async function handleDeleteAluno() {
    if (!selectedAluno) return;

    try {
      setErro("");
      setLoading(true);

      await deleteStudent(selectedAluno.id);

      showToast.success(
        "Aluno desativado",
        "Registro do aluno desativo com sucesso",
      );

      await carregarAlunos();

      setSelectedAluno(null);
      setOpenDelete(false);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      showToast.error(
        "Erro ao excluir aluno",
        "Não foi possível excluir o aluno.",
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o aluno.",
      );
    } finally {
      setLoading(false);
    }
  }

  // RENDERIZAÇÃO
  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Alunos
        </h2>

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {erro}
          </div>
        )}

        {/* BOTÃO CADASTRAR */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setErro("");
              setNovoAluno({ ...NOVO_ALUNO_INICIAL });
              setOpenAdd(true);
            }}
            className="bg-blue-900 cursor-pointer hover:brightness-115 dark:bg-[#242424] dark:hover:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Matricular Aluno</span>
          </Button>
        </div>

        {/* TABELA */}

        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow className="dark:border-zinc-700">
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Nome
              </TableHead>

              <TableHead className="text-zinc-800 dark:text-white font-bold">
                CPF
              </TableHead>

              <TableHead className="text-zinc-800 dark:text-white font-bold">
                E-mail
              </TableHead>

              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Data de Matrícula
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
            {loading && alunos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Carregando alunos...
                </TableCell>
              </TableRow>
            )}

            {!loading && alunos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-zinc-500"
                >
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            )}

            {alunos.map((aluno) => (
              <TableRow
                key={aluno.id}
                className="dark:border-zinc-700 dark:hover:bg-[#303030]"
              >
                <TableCell className="text-zinc-800 dark:text-white">
                  {aluno.nome}
                </TableCell>

                <TableCell className="text-zinc-800 dark:text-white">
                  {aluno.cpf}
                </TableCell>

                <TableCell className="text-zinc-800 dark:text-white">
                  {aluno.email}
                </TableCell>

                <TableCell className="text-zinc-800 dark:text-white">
                  {formatarData(aluno.dtMatricula)}
                </TableCell>

                <TableCell className="text-zinc-800 dark:text-white">
                  {aluno.status}
                </TableCell>

                <TableCell className="text-right">
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
                      <DropdownMenuItem onClick={() => handleOpenEdit(aluno)}>
                        <Pencil size={12} />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setSelectedAluno(aluno);
                          setErro("");
                          setOpenDelete(true);
                        }}
                      >
                        <Trash size={12} />
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      {/* MODAL CADASTRAR */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Matricular Aluno</DialogTitle>

            <DialogDescription className="text-sm text-zinc-500">
              Preencha os campos para matricular um aluno.
            </DialogDescription>
          </DialogHeader>

          <AlunoFormFields
            values={novoAluno}
            onChange={(field, value) =>
              setNovoAluno((prev) => ({
                ...prev,
                [field]: value,
              }))
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button onClick={handleAddAluno} disabled={loading}>
              {loading ? "Matriculando..." : "Matricular"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>

            <DialogDescription className="text-sm text-zinc-500">
              Altere os campos desejados e salve.
            </DialogDescription>
          </DialogHeader>

          {studentEditando && (
            <AlunoFormFields
              values={alunoEmEdicao}
              onChange={(field, value) =>
                setAlunoEmEdicao((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleEditAluno}
              disabled={loading || !studentEditando}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar Aluno</DialogTitle>

            <DialogDescription className="text-sm text-zinc-500">
              O aluno será desativado, mas seus dados permanecerão registrados
              no sistema.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Deseja realmente desativar o aluno{" "}
            <strong>{selectedAluno?.nome}</strong>?
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteAluno}
              disabled={loading}
            >
              {loading ? "Desativando..." : "Desativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlunoFormFields({
  values,
  onChange,
}: {
  values: AlunoFormValues;
  onChange: (field: keyof AlunoFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
      {/* NOME */}

      <Field>
        <FieldLabel htmlFor="studentName">Nome do Aluno *</FieldLabel>

        <Input
          id="studentName"
          placeholder="Nome completo"
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </Field>

      {/* CPF */}

      <Field>
        <FieldLabel htmlFor="cpf">CPF do Aluno *</FieldLabel>

        <Input
          id="cpf"
          placeholder="123.456.789-00"
          value={values.cpf}
          maxLength={14}
          onChange={(e) => onChange("cpf", e.target.value)}
        />
      </Field>

      {/* EMAIL */}

      <Field>
        <FieldLabel htmlFor="email">E-mail *</FieldLabel>

        <Input
          id="email"
          type="email"
          placeholder="aluno@email.com"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>

      {/* TELEFONE */}

      <Field>
        <FieldLabel htmlFor="phone">Telefone *</FieldLabel>

        <Input
          id="phone"
          placeholder="(11) 99999-9999"
          value={values.telefone}
          onChange={(e) => onChange("telefone", e.target.value)}
        />
      </Field>

      {/* TELEFONE SECUNDÁRIO */}

      <Field>
        <FieldLabel htmlFor="secondaryPhone">Telefone Secundário</FieldLabel>

        <Input
          id="secondaryPhone"
          placeholder="(11) 99999-9999"
          value={values.telefoneSecundario}
          onChange={(e) => onChange("telefoneSecundario", e.target.value)}
        />
      </Field>

      {/* ENDEREÇO */}

      <Field>
        <FieldLabel htmlFor="address">Endereço *</FieldLabel>

        <Input
          id="address"
          placeholder="Rua, número, bairro e cidade"
          value={values.endereco}
          onChange={(e) => onChange("endereco", e.target.value)}
        />
      </Field>

      {/* DATA DE NASCIMENTO */}

      <Field>
        <FieldLabel htmlFor="dtBirth">Data de Nascimento *</FieldLabel>

        <Input
          id="dtBirth"
          type="date"
          value={values.dtNascimento}
          onChange={(e) => onChange("dtNascimento", e.target.value)}
        />
      </Field>

      {/* GÊNERO */}

      <Field>
        <FieldLabel htmlFor="gender">Gênero</FieldLabel>

        <Select
          value={values.genero}
          onValueChange={(value) => onChange("genero", value)}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Selecione o gênero" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {GENEROS.map((genero) => (
                <SelectItem key={genero.value} value={genero.value}>
                  {genero.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* NACIONALIDADE */}

      <Field>
        <FieldLabel htmlFor="nationality">Nacionalidade</FieldLabel>

        <Input
          id="nationality"
          placeholder="Brasileira"
          value={values.nacionalidade}
          onChange={(e) => onChange("nacionalidade", e.target.value)}
        />
      </Field>

      {/* NATURALIDADE */}

      <Field>
        <FieldLabel htmlFor="naturalness">Naturalidade</FieldLabel>

        <Input
          id="naturalness"
          placeholder="Cidade de nascimento"
          value={values.naturalidade}
          onChange={(e) => onChange("naturalidade", e.target.value)}
        />
      </Field>

      {/* FOTO */}

      <Field>
        <FieldLabel htmlFor="photoUrl">URL da Foto</FieldLabel>

        <Input
          id="photoUrl"
          placeholder="https://..."
          value={values.fotoUrl}
          onChange={(e) => onChange("fotoUrl", e.target.value)}
        />
      </Field>

      {/* CONTATO DE EMERGÊNCIA */}

      <Field>
        <FieldLabel htmlFor="emergencyContact">
          Contato de Emergência *
        </FieldLabel>

        <Input
          id="emergencyContact"
          placeholder="Nome e telefone para contato"
          value={values.contatoEmergencia}
          onChange={(e) => onChange("contatoEmergencia", e.target.value)}
        />
      </Field>

      {/* STATUS */}

      <Field>
        <FieldLabel htmlFor="studentStatus">Status do Aluno</FieldLabel>

        <Select
          value={values.status}
          onValueChange={(value) => onChange("status", value)}
        >
          <SelectTrigger id="studentStatus">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {STATUS_ALUNO.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* DATA DE MATRÍCULA */}

      <Field>
        <FieldLabel htmlFor="dtEnrollment">Data de Matrícula *</FieldLabel>

        <Input
          id="dtEnrollment"
          type="date"
          value={values.dtMatricula}
          onChange={(e) => onChange("dtMatricula", e.target.value)}
        />
      </Field>
    </div>
  );
}
