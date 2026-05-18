import { useState } from "react";
import { Pencil, Plus, MoreHorizontalIcon, Trash } from "lucide-react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type Curso = {
  id: number;
  nome: string;
  modalidade: string;
  cargaHoraria: string;
  semestres: string;
  docente: string;
  status: "Ativo" | "Inativo";
};

type Modalidade = {
  id: number;
  description: string;
};

const modalidades: Modalidade[] = [
  { id: 1, description: "EAD" },
  { id: 2, description: "Presencial" },
  { id: 3, description: "Híbrido" },
];

type Docente = {
  id: number;
  nome: string;
};

const docentes: Docente[] = [
  { id: 1, nome: "Ana Paula Silva" },
  { id: 2, nome: "Marcos Paulo César" },
  { id: 3, nome: "Maria Paula da Silva" },
];

export default function Cursos(): JSX.Element {
  const [cursos, setCursos] = useState<Curso[]>([
    {
      id: 1,
      nome: "Análise e Desenvolvimento de Sistemas",
      modalidade: "EAD",
      semestres: "5",
      cargaHoraria: "2400",
      docente: "Ana Paula Silva",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Administração",
      modalidade: "Presencial",
      semestres: "5",
      cargaHoraria: "3000",
      docente: "Marcos Paulo César",
      status: "Ativo",
    },
  ]);

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [novoCurso, setNovoCurso] = useState({
    nome: "",
    modalidade: "",
    semestres: "1",
    cargaHoraria: "1",
    docente: "",
  });

  function handleAddCurso() {
    const novo: Curso = {
      id: Date.now(),
      nome: novoCurso.nome,
      modalidade: novoCurso.modalidade,
      semestres: novoCurso.semestres,
      cargaHoraria: novoCurso.cargaHoraria,
      docente: novoCurso.docente,
      status: "Ativo",
    };

    setCursos((prev) => [...prev, novo]);

    setNovoCurso({
      nome: "",
      modalidade: "",
      semestres: "0",
      cargaHoraria: "0",
      docente: "",
    });

    setOpenAdd(false);
  }

  function handleDeleteCurso() {
    if (!selectedCurso) return;

    setCursos((prev) => prev.filter((c) => c.id !== selectedCurso.id));

    setOpenDelete(false);
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Cursos</h2>

        {/* BOTÃO */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115"
          >
            <Plus size={18} />
            <span>Cadastrar Curso</span>
          </Button>
        </div>

        {/* TABELA */}
        <Table className="bg-white p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Semestres</TableHead>
              <TableHead>Carga Horária</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell>{curso.nome}</TableCell>
                <TableCell>{curso.docente}</TableCell>
                <TableCell>{curso.modalidade}</TableCell>
                <TableCell>{curso.semestres}</TableCell>
                <TableCell>{curso.cargaHoraria}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCurso(curso);
                          setOpenEdit(true);
                        }}
                      >
                        <span>
                          <Pencil size={10} />
                        </span>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setSelectedCurso(curso);
                          setOpenDelete(true);
                        }}
                      >
                        <span>
                          <Trash size={10} />
                        </span>
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

      {/* MODAL ADICIONAR */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Curso</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Preencha os campos para cadastrar um novo curso.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="courseName">Nome do Curso</FieldLabel>
              <Input
                id="courseName"
                autoComplete="off"
                placeholder="Tecnologia em Sistemas para a Internet"
                value={novoCurso.nome}
                onChange={(e) =>
                  setNovoCurso({
                    ...novoCurso,
                    nome: e.target.value,
                  })
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="modality">Modalidade</FieldLabel>
              <Select
                value={novoCurso.modalidade}
                onValueChange={(value) =>
                  setNovoCurso({ ...novoCurso, modalidade: value })
                }
              >
                <SelectTrigger id="modality">
                  <SelectValue placeholder="EAD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modalidades.map((modalidade) => (
                      <SelectItem
                        key={modalidade.id}
                        value={String(modalidade.description)}
                      >
                        {modalidade.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="teacher">Docente</FieldLabel>
              <Select
                value={novoCurso.docente}
                onValueChange={(value) =>
                  setNovoCurso({ ...novoCurso, docente: value })
                }
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Maria Paula da Silva" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {docentes.map((docente) => (
                      <SelectItem key={docente.id} value={String(docente.nome)}>
                        {docente.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="semesters">Semestres</FieldLabel>
              <Input
                id="semesters"
                autoComplete="off"
                placeholder="8"
                value={novoCurso.semestres}
                onChange={(e) =>
                  setNovoCurso({
                    ...novoCurso,
                    semestres: e.target.value,
                  })
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="duration">Carga Horária</FieldLabel>
              <Input
                id="duration"
                autoComplete="off"
                placeholder="3200"
                value={novoCurso.cargaHoraria}
                onChange={(e) =>
                  setNovoCurso({
                    ...novoCurso,
                    cargaHoraria: e.target.value,
                  })
                }
                required
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddCurso}
              variant="secondary"
              className="cursor-pointer hover:brightness-115"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCurso}
              className="cursor-pointer hover:brightness-115"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Altere as informações que deseje e clique em salvar.
            </DialogDescription>
          </DialogHeader>

          {selectedCurso && (
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="courseName">Nome do Curso</FieldLabel>
                <Input
                  id="courseName"
                  autoComplete="off"
                  placeholder="Tecnologia em Sistemas para a Internet"
                  value={selectedCurso.nome}
                  onChange={(e) =>
                    setSelectedCurso({
                      ...selectedCurso,
                      nome: e.target.value,
                    })
                  }
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="modality">Modalidade</FieldLabel>
                <Select
                  value={selectedCurso.modalidade}
                  onValueChange={(value) =>
                    setSelectedCurso({ ...selectedCurso, modalidade: value })
                  }
                >
                  <SelectTrigger id="modality">
                    <SelectValue placeholder="EAD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {modalidades.map((modalidade) => (
                        <SelectItem
                          key={modalidade.id}
                          value={modalidade.description}
                        >
                          {modalidade.description}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="teacher">Docente</FieldLabel>
                <Select
                  value={selectedCurso.docente}
                  onValueChange={(value) =>
                    setSelectedCurso({ ...selectedCurso, docente: value })
                  }
                >
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Maria Paula da Silva" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {docentes.map((docente) => (
                        <SelectItem
                          key={docente.id}
                          value={String(docente.nome)}
                        >
                          {docente.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="semesters">Semestres</FieldLabel>
                <Input
                  id="semesters"
                  autoComplete="off"
                  placeholder="8"
                  value={selectedCurso.semestres}
                  onChange={(e) =>
                    setSelectedCurso({
                      ...selectedCurso,
                      semestres: e.target.value,
                    })
                  }
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="duration">Carga Horária</FieldLabel>
                <Input
                  id="duration"
                  autoComplete="off"
                  placeholder="3200"
                  value={selectedCurso.cargaHoraria}
                  onChange={(e) =>
                    setSelectedCurso({
                      ...selectedCurso,
                      cargaHoraria: e.target.value,
                    })
                  }
                  required
                />
              </Field>
              <Button
                onClick={() => {
                  setCursos((prev) =>
                    prev.map((c) =>
                      c.id === selectedCurso.id ? selectedCurso : c,
                    ),
                  );

                  setOpenEdit(false);
                }}
              >
                Atualizar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Curso</DialogTitle>
          </DialogHeader>

          <p>Deseja realmente excluir este curso?</p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteCurso}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
