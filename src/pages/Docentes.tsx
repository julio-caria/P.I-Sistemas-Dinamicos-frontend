import { useState } from "react";
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

type Docente = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  endereco: string;
  matriculaFuncional: string;
  titulacao: string;
  curso: string;
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

type Titulacao = {
  id: number;
  nome: string;
};

const titulacoes: Titulacao[] = [
  { id: 1, nome: "Graduação" },
  { id: 2, nome: "Mestre" },
  { id: 3, nome: "Doutor" },
];

const NOVO_DOCENTE_INICIAL = {
  nome: "",
  cpf: "",
  email: "",
  endereco: "",
  matriculaFuncional: "",
  titulacao: "",
  curso: "",
};

export default function Docentes(): JSX.Element {
  const [docentes, setDocentes] = useState<Docente[]>([
    {
      id: 1,
      nome: "Carlos Henrique",
      cpf: "123.456.789-00",
      email: "carlos@faculdade.com",
      endereco: "Av. Nações Unidas, São Paulo, 23",
      matriculaFuncional: "123456789",
      titulacao: "Mestre",
      curso: "Ciência da Computação",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Fernanda Souza",
      cpf: "987.654.321-00",
      email: "fernanda@faculdade.com",
      endereco: "Av. Nações Unidas, São Paulo, 23",
      matriculaFuncional: "987654321",
      titulacao: "Mestre",
      curso: "Administração",
      status: "Ativo",
    },
  ]);

  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoDocente, setNovoDocente] = useState(NOVO_DOCENTE_INICIAL);

  function handleAddDocente() {
    const novo: Docente = {
      id: Date.now(),
      nome: novoDocente.nome,
      cpf: novoDocente.cpf,
      email: novoDocente.email,
      endereco: novoDocente.endereco,
      matriculaFuncional: novoDocente.matriculaFuncional,
      titulacao: novoDocente.titulacao,
      curso: novoDocente.curso,
      status: "Ativo",
    };

    setDocentes((prev) => [...prev, novo]);
    setNovoDocente(NOVO_DOCENTE_INICIAL);
    setOpenAdd(false);
  }

  function handleEditDocente() {
    if (!selectedDocente) return;
    setDocentes((prev) =>
      prev.map((d) => (d.id === selectedDocente.id ? selectedDocente : d)),
    );
    setOpenEdit(false);
  }

  function handleDeleteDocente() {
    if (!selectedDocente) return;
    setDocentes((prev) => prev.filter((d) => d.id !== selectedDocente.id));
    setOpenDelete(false);
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
              <TableHead className="text-zinc-800 font-bold dark:text-white">Nome</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">CPF</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">E-mail</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Endereço
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Matricula Funcional
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Titulação
              </TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Curso</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Status</TableHead>
              <TableHead className="text-zinc-800 font-bold dark:text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docentes.map((docente) => (
              <TableRow key={docente.id} className="dark:border-zinc-700 dark:hover:bg-[#303030]">
                <TableCell className="text-zinc-800 dark:text-white">{docente.nome}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.cpf}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.email}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.endereco}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.matriculaFuncional}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.titulacao}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.curso}</TableCell>
                <TableCell className="text-zinc-800 dark:text-white">{docente.status}</TableCell>
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
                          setSelectedDocente(docente);
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
                          setSelectedDocente(docente);
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

          <DocenteFormFields
            values={novoDocente}
            onChange={(field, value) =>
              setNovoDocente((prev) => ({ ...prev, [field]: value }))
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)} className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]">
              Cancelar
            </Button>
            <Button onClick={handleAddDocente}>Cadastrar</Button>
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

          {selectedDocente && (
            <DocenteFormFields
              values={{
                nome: selectedDocente.nome,
                cpf: selectedDocente.cpf,
                email: selectedDocente.email,
                endereco: selectedDocente.endereco,
                matriculaFuncional: selectedDocente.matriculaFuncional,
                titulacao: selectedDocente.titulacao,
                curso: selectedDocente.curso
              }}
              onChange={(field, value) =>
                setSelectedDocente((prev) =>
                  prev ? { ...prev, [field]: value } : prev,
                )
              }
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)} className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]">
              Cancelar
            </Button>
            <Button onClick={handleEditDocente}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Registro</DialogTitle>
          </DialogHeader>

          <p className="text-zinc-800 dark:text-white">Deseja realmente excluir este registro?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteDocente}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type DocenteFormValues = {
  nome: string;
  cpf: string;
  email: string;
  endereco: string;
  matriculaFuncional: string;
  titulacao: string;
  curso: string;
};

function DocenteFormFields({
  values,
  onChange,
}: {
  values: DocenteFormValues;
  onChange: (field: keyof DocenteFormValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="teacherName" >Nome do Docente</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="cpf">CPF</FieldLabel>
        <Input
          id="cpf"
          autoComplete="off"
          placeholder="123.456.789-00"
          value={values.cpf}
          required
          maxLength={11}
          onChange={(e) => onChange("cpf", e.target.value)}
          className="dark:bg-[#181818] dark:text-white dark:border-[#363636]
                     dark:placeholder:text-zinc-500"
        />
      </Field>
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="email">E-mail</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="address">Endereço</FieldLabel>
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
        <FieldLabel className="dark:text-white" htmlFor="titration">Titulação</FieldLabel>
        <Select
          value={values.titulacao}
          onValueChange={(value) => onChange("titulacao", value)}
          required
        >
          <SelectTrigger id="titration">
            <SelectValue placeholder="Selecione um título" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {titulacoes.map((titulacao) => (
                <SelectItem key={titulacao.id} value={titulacao.nome}>
                  {titulacao.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
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
    </div>
  );
}
