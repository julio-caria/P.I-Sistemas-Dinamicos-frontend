import { useState } from "react";
import {
  Pencil,
  Plus,
  Trash,
  MoreHorizontalIcon,
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
import { Field, FieldLabel } from "@/components/ui/field";
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

type Turma = {
  id: number;
  nome: string;
  curso: string;
  vagas: number;
  semestre: number;
  horario: string;
  status: "Ativo" | "Inativo";
};

const NOVA_TURMA_INICIAL = {
  nome: "",
  curso: "",
  vagas: 0,
  semestre: 0,
  horario: "",
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

export default function Turmas(): JSX.Element {
  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: 1,
      nome: "ADS 2026 - A",
      curso: "ADS",
      vagas: 30,
      semestre: 5,
      horario: "20h30",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "ADM 2026 - B",
      curso: "Administração",
      vagas: 30,
      semestre: 5,
      horario: "19h00",
      status: "Ativo",
    },
  ]);

  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novaTurma, setNovaTurma] = useState(NOVA_TURMA_INICIAL);

  function handleAddTurma() {
    const nova: Turma = {
      id: Date.now(),
      nome: novaTurma.nome,
      curso: novaTurma.curso,
      vagas: novaTurma.vagas,
      semestre: novaTurma.semestre,
      horario: novaTurma.horario,
      status: "Ativo",
    };

    setTurmas((prev) => [...prev, nova]);
    setNovaTurma(NOVA_TURMA_INICIAL);
    setOpenAdd(false);
  }

  function handleEditTurma() {
    if (!selectedTurma) return;
    setTurmas((prev) =>
      prev.map((t) => (t.id === selectedTurma.id ? selectedTurma : t)),
    );
    setOpenEdit(false);
  }

  function handleDeleteTurma() {
    if (!selectedTurma) return;
    setTurmas((prev) => prev.filter((t) => t.id !== selectedTurma.id));
    setOpenDelete(false);
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Turmas</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115"
          >
            <Plus size={18} />
            <span>Adicionar Turma</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold">Nome</TableHead>
              <TableHead className="text-zinc-800 font-bold">Curso</TableHead>
              <TableHead className="text-zinc-800 font-bold">Vagas</TableHead>
              <TableHead className="text-zinc-800 font-bold">
                Semestre
              </TableHead>
              <TableHead className="text-zinc-800 font-bold">Horário</TableHead>
              <TableHead className="text-zinc-800 font-bold">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow key={turma.id}>
                <TableCell>{turma.nome}</TableCell>
                <TableCell>{turma.curso}</TableCell>
                <TableCell>{turma.vagas}</TableCell>
                <TableCell>{turma.semestre}</TableCell>
                <TableCell>{turma.horario}</TableCell>
                <TableCell>{turma.status}</TableCell>
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
                          setSelectedTurma(turma);
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
                          setSelectedTurma(turma);
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
            <DialogTitle>Cadastrar Docente</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Preencha os campos para cadastrar um docente.
            </DialogDescription>
          </DialogHeader>

          <TurmaFormFields
            values={novaTurma}
            onChange={(field, value) =>
              setNovaTurma((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTurma}>Cadastrar</Button>
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

          {selectedTurma && (
            <TurmaFormFields
              values={{
                nome: selectedTurma.nome,
                curso: selectedTurma.curso,
                vagas: selectedTurma.vagas,
                semestre: selectedTurma.semestre,
                horario: selectedTurma.horario,
              }}
              onChange={(field, value) =>
                setSelectedTurma((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTurma}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Turma</DialogTitle>
          </DialogHeader>

          <p>Deseja realmente excluir esta turma?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteTurma}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type TurmaFormValues = {
  nome: string;
  curso: string;
  vagas: number;
  semestre: number;
  horario: string;
};

function TurmaFormFields({
  values,
  onChange,
}: {
  values: TurmaFormValues;
  onChange: (field: keyof TurmaFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="course">Curso</FieldLabel>
        <Select
          value={values.curso}
          onValueChange={(value) => onChange("curso", value)}
          required
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
        <FieldLabel htmlFor="description">Descrição</FieldLabel>
        <Input
          id="description"
          autoComplete="off"
          placeholder="TSI - Período Noturno - 3 Semestre"
          required
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="vagas">Vagas</FieldLabel>
        <Input
          id="vagas"
          autoComplete="off"
          placeholder="30"
          value={values.vagas}
          required
          maxLength={11}
          onChange={(e) => onChange("vagas", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="semestre">Semestre</FieldLabel>
        <Input
          id="semestre"
          autoComplete="off"
          required
          placeholder="6"
          value={values.semestre}
          onChange={(e) => onChange("semestre", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="horario">Horário</FieldLabel>
        <Input
          id="horario"
          autoComplete="off"
          placeholder="19h30"
          value={values.horario}
          required
          onChange={(e) => onChange("horario", e.target.value)}
        />
      </Field>
    </div>
  );
}
