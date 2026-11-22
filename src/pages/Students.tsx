import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  deleteStudent,
  type Student,
} from "@/services/studentService";
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

type Aluno = {
  id: string;
  nome: string;
  cpf: string;
  curso: string;
  email: string;
  dtMatricula: string;
  status: "Ativo" | "Inativo";
};

type Curso = {
  id: number;
  nome: string;
};

const cursos: Curso[] = [
  { id: 1, nome: "Tecnologia em Sistemas para a Internet" },
  { id: 2, nome: "Ciência da Computação" },
  { id: 3, nome: "Análise e Desenvolvimento de Sistemas" },
  { id: 4, nome: "Design Gráfico" },
  { id: 5, nome: "Desenvolvimento Web" },
  { id: 6, nome: "Sistemas da Informação" },
  { id: 7, nome: "Administração" },
];

const NOVO_ALUNO_INICIAL = {
  nome: "",
  cpf: "",
  curso: "",
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
};

export default function Alunos(): JSX.Element {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoAluno, setNovoAluno] = useState(NOVO_ALUNO_INICIAL);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const students = await getStudents();

        const alunosFormatados: Aluno[] = students.map(
          (student: Student) => ({
            id: student.id,
            nome: student.name,
            cpf: student.cpf,
            curso: "Não atribuído",
            email: student.email,
            dtMatricula: student.admissionDate,
            status: student.isActive ? "Ativo" : "Inativo",
          }),
        );

        setAlunos(alunosFormatados);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    }

    carregarAlunos();
  }, []);


  async function handleAddAluno() {
    try {
      await createStudent({
        name: novoAluno.nome,
        cpf: novoAluno.cpf.replace(/\D/g, ""),
        email: novoAluno.email,
        phone: novoAluno.telefone,
        secondaryPhone: novoAluno.telefoneSecundario || undefined,
        address: novoAluno.endereco,
        admissionDate: novoAluno.dtMatricula,
        birthDate: novoAluno.dtNascimento,
        gender: novoAluno.genero || undefined,
        nationality: novoAluno.nacionalidade || undefined,
        naturalness: novoAluno.naturalidade || undefined,
        photoUrl: novoAluno.fotoUrl || undefined,
        emergencyContact: novoAluno.contatoEmergencia,
      });

      const students = await getStudents();

      const alunosFormatados: Aluno[] = students.map((student) => ({
        id: student.id,
        nome: student.name,
        cpf: student.cpf,
        curso: "Não atribuído",
        email: student.email,
        dtMatricula: student.admissionDate,
        status: student.isActive ? "Ativo" : "Inativo",
      }));

      setAlunos(alunosFormatados);
      setNovoAluno(NOVO_ALUNO_INICIAL);
      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  }


  function handleEditAluno() {
    if (!selectedAluno) return;
    setAlunos((prev) =>
      prev.map((a) => (a.id === selectedAluno.id ? selectedAluno : a)),
    );
    setOpenEdit(false);
  }


  async function handleDeleteAluno() {
    if (!selectedAluno) return;

    try {
      await deleteStudent(selectedAluno.id);

      const students = await getStudents();

      const alunosFormatados: Aluno[] = students.map((student) => ({
        id: student.id,
        nome: student.name,
        cpf: student.cpf,
        curso: "Não atribuído",
        email: student.email,
        dtMatricula: student.admissionDate,
        status: student.isActive ? "Ativo" : "Inativo",
      }));

      setAlunos(alunosFormatados);
      setSelectedAluno(null);
      setOpenDelete(false);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }


  function formatarData(iso: string) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Alunos</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115
                       dark:bg-[#242424] dark:hover:bg-[#303030]
                       dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Matricular Aluno</span>
          </Button>
        </div>

        {/* TABELA */}

        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow className="dark:border-zinc-700">
              <TableHead className="text-zinc-800 dark:text-white font-bold">Nome</TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">CPF</TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">E-mail</TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">Curso</TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Data de Matrícula
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">Status</TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
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
                  {aluno.curso}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAluno(aluno);
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
                          setSelectedAluno(aluno);
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
            <DialogTitle>Matricular Aluno</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Preencha os campos para matricular um aluno.
            </DialogDescription>
          </DialogHeader>

          <AlunoFormFields
            values={novoAluno}
            onChange={(field, value) =>
              setNovoAluno((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAluno}>Matricular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL EDITAR ── */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Altere os campos desejados e salve.
            </DialogDescription>
          </DialogHeader>

          {selectedAluno && (
            <AlunoFormFields
              values={{
                nome: selectedAluno.nome,
                cpf: selectedAluno.cpf,
                curso: selectedAluno.curso,
                email: selectedAluno.email,
                dtMatricula: selectedAluno.dtMatricula,
                telefone: "",
                telefoneSecundario: "",
                endereco: "",
                dtNascimento: "",
                genero: "",
                nacionalidade: "",
                naturalidade: "",
                fotoUrl: "",
                contatoEmergencia: "",
              }}
              onChange={(field, value) =>
                setSelectedAluno((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditAluno}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL EXCLUIR ── */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Aluno</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-zinc-600">
            Deseja realmente excluir o aluno{" "}
            <strong>{selectedAluno?.nome}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAluno}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type AlunoFormValues = {
  nome: string;
  cpf: string;
  curso: string;
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
};


function AlunoFormFields({
  values,
  onChange,
}: {
  values: AlunoFormValues;
  onChange: (field: keyof AlunoFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
      <Field>
        <FieldLabel htmlFor="studentName">Nome do Aluno</FieldLabel>
        <Input
          id="studentName"
          placeholder="Nome completo"
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cpf">CPF do Aluno</FieldLabel>
        <Input
          id="cpf"
          placeholder="123.456.789-00"
          value={values.cpf}
          maxLength={14}
          onChange={(e) => onChange("cpf", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="aluno@email.com"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Telefone</FieldLabel>
        <Input
          id="phone"
          placeholder="(11) 99999-9999"
          value={values.telefone}
          onChange={(e) => onChange("telefone", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="secondaryPhone">Telefone Secundário</FieldLabel>
        <Input
          id="secondaryPhone"
          placeholder="(11) 99999-9999"
          value={values.telefoneSecundario}
          onChange={(e) => onChange("telefoneSecundario", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="address">Endereço</FieldLabel>
        <Input
          id="address"
          placeholder="Rua, número, bairro e cidade"
          value={values.endereco}
          onChange={(e) => onChange("endereco", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="dtBirth">Data de Nascimento</FieldLabel>
        <Input
          id="dtBirth"
          type="date"
          value={values.dtNascimento}
          onChange={(e) => onChange("dtNascimento", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="gender">Gênero</FieldLabel>
        <Input
          id="gender"
          placeholder="Gênero"
          value={values.genero}
          onChange={(e) => onChange("genero", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="nationality">Nacionalidade</FieldLabel>
        <Input
          id="nationality"
          placeholder="Brasileira"
          value={values.nacionalidade}
          onChange={(e) => onChange("nacionalidade", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="naturalness">Naturalidade</FieldLabel>
        <Input
          id="naturalness"
          placeholder="Cidade de nascimento"
          value={values.naturalidade}
          onChange={(e) => onChange("naturalidade", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="photoUrl">URL da Foto</FieldLabel>
        <Input
          id="photoUrl"
          placeholder="https://..."
          value={values.fotoUrl}
          onChange={(e) => onChange("fotoUrl", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="emergencyContact">Contato de Emergência</FieldLabel>
        <Input
          id="emergencyContact"
          placeholder="Nome e telefone para contato"
          value={values.contatoEmergencia}
          onChange={(e) => onChange("contatoEmergencia", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="course">Curso</FieldLabel>
        <Select
          value={values.curso}
          onValueChange={(value) => onChange("curso", value)}
        >
          <SelectTrigger id="course">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cursos.map((curso) => (
                <SelectItem key={curso.id} value={curso.nome}>
                  {curso.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="dtEnrollment">Data de Matrícula</FieldLabel>
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

