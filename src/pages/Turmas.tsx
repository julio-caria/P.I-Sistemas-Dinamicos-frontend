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
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Turmas</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115
                       dark:bg-[#242424] dark:hover:bg-[#303030]
                       dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Adicionar Turma</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Nome</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Curso</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Vagas</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Semestre
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Horário</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow key={turma.id} className="dark:border-zinc-700 dark:hover:bg-[#303030]">
                <TableCell className="text-zinc-800 dark:text-white">{turma.nome}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white" >{turma.curso}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{turma.vagas}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{turma.semestre}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{turma.horario}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{turma.status}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 dark:text-white dark:hover:bg-[#383838]">
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
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Cadastrar Docente</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
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
            <Button variant="outline" onClick={() => setOpenAdd(false)} className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]">
              Cancelar
            </Button>
            <Button onClick={handleAddTurma} className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]">Cadastrar</Button>
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
            <Button variant="outline" onClick={() => setOpenEdit(false)} className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]">
              Cancelar
            </Button>
            <Button onClick={handleEditTurma} className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]">Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Excluir Turma</DialogTitle>
          </DialogHeader>

          <p className="text-zinc-800 dark:text-white">Deseja realmente excluir esta turma?</p>

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
        <FieldLabel className="dark:text-white" htmlFor="course">Curso</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="description">Descrição</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="vagas">Vagas</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="semestre">Semestre</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="horario">Horário</FieldLabel>
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
