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
  id: number;
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
};
export default function Alunos(): JSX.Element {
  const [alunos, setAlunos] = useState<Aluno[]>([
    {
      id: 1,
      nome: "João Gabriel",
      cpf: "123.456.789-00",
      curso: "Análise e Desenvolvimento de Sistemas",
      email: "joao@email.com",
      dtMatricula: "2026-02-01", 
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Maria Eduarda",
      cpf: "321.654.987-00",
      curso: "Administração",
      email: "maria@email.com",
      dtMatricula: "2026-01-23",
      status: "Ativo",
    },
  ]);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoAluno, setNovoAluno] = useState(NOVO_ALUNO_INICIAL);

  function handleAddAluno() {
    const novo: Aluno = {
      id: Date.now(),
      nome: novoAluno.nome,
      cpf: novoAluno.cpf,
      curso: novoAluno.curso,
      email: novoAluno.email,
      dtMatricula: novoAluno.dtMatricula, 
      status: "Ativo",
    };

    setAlunos((prev) => [...prev, novo]);
    setNovoAluno(NOVO_ALUNO_INICIAL); 
    setOpenAdd(false);
  }

  function handleEditAluno() {
    if (!selectedAluno) return;
    setAlunos((prev) =>
      prev.map((a) => (a.id === selectedAluno.id ? selectedAluno : a)),
    );
    setOpenEdit(false);
  }

  function handleDeleteAluno() {
    if (!selectedAluno) return;
    setAlunos((prev) => prev.filter((a) => a.id !== selectedAluno.id));
    setOpenDelete(false);
  }

  function formatarData(iso: string) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Alunos</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115"
          >
            <Plus size={18} />
            <span>Matricular Aluno</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold">Nome</TableHead>
              <TableHead className="text-zinc-800 font-bold">CPF</TableHead>
              <TableHead className="text-zinc-800 font-bold">E-mail</TableHead>
              <TableHead className="text-zinc-800 font-bold">Curso</TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Data de Matrícula
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.cpf}</TableCell>
                <TableCell>{aluno.email}</TableCell>
                <TableCell>{aluno.curso}</TableCell>
                <TableCell>{formatarData(aluno.dtMatricula)}</TableCell>
                <TableCell>{aluno.status}</TableCell>
                <TableCell className="text-right">
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
};

function AlunoFormFields({
  values,
  onChange,
}: {
  values: AlunoFormValues;
  onChange: (field: keyof AlunoFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="studentName">Nome do Aluno</FieldLabel>
        <Input
          id="studentName"
          autoComplete="off"
          placeholder="John Doe"
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cpf">CPF do Aluno</FieldLabel>
        <Input
          id="cpf"
          autoComplete="off"
          placeholder="123.456.789-00"
          value={values.cpf}
          maxLength={11}
          onChange={(e) => onChange("cpf", e.target.value)}
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
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          autoComplete="off"
          placeholder="aluno@email.com"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
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
