import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  deleteCourse,
} from "@/services/courseService";
import type { Course } from "@/services/courseService";
import { Pencil, Plus, MoreHorizontalIcon, Trash, Search } from "lucide-react";
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
import { showToast } from "@/utils/toast";

type Curso = {
  id: string;
  nome: string;
  modalidade: string;
  cargaHoraria: number;
  semestres: number;
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
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [busca, setBusca] = useState("");

  const cursosFiltrados = cursos.filter((curso) => {
    const termo = busca.toLowerCase().trim();

    return (
      curso.nome.toLowerCase().includes(termo) ||
      curso.modalidade.toLowerCase().includes(termo)
    );
  });

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

  useEffect(() => {
    async function carregarCursos() {
      try {
        const data = await getCourses();

        const cursosFormatados: Curso[] = data.map((curso: Course) => ({
          id: curso.id,
          nome: curso.name,
          modalidade:
            curso.modality === "in_person"
              ? "Presencial"
              : curso.modality === "online"
                ? "EAD"
                : "Híbrido",
          cargaHoraria: curso.workloadHours,
          semestres: curso.durationSemesters,
          docente: "Não atribuído",
          status: curso.isActive ? "Ativo" : "Inativo",
        }));

        setCursos(cursosFormatados);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      }
    }

    carregarCursos();
  }, []);

  async function handleAddCurso() {
    try {
      const semestres = Number(novoCurso.semestres);
      const cargaHoraria = Number(novoCurso.cargaHoraria);

      if (
        !novoCurso.nome.trim() ||
        !novoCurso.modalidade ||
        !Number.isFinite(semestres) ||
        !Number.isFinite(cargaHoraria) ||
        semestres < 1 ||
        cargaHoraria < 1
      ) {
        showToast.warning(
          "Campos vazios",
          "Preencha todos os campos corretamente.",
        );
        return;
      }

      await createCourse({
        name: novoCurso.nome.trim(),
        workloadHours: cargaHoraria,
        durationSemesters: semestres,
        modality:
          novoCurso.modalidade === "Presencial"
            ? "in_person"
            : novoCurso.modalidade === "EAD"
              ? "online"
              : "hybrid",
      });

      showToast.success("Curso cadastrado", "Novo curso registrado com sucesso");

      const data = await getCourses();

      const cursosFormatados: Curso[] = data.map((curso: Course) => ({
        id: curso.id,
        nome: curso.name,
        modalidade:
          curso.modality === "in_person"
            ? "Presencial"
            : curso.modality === "online"
              ? "EAD"
              : "Híbrido",
        cargaHoraria: curso.workloadHours,
        semestres: curso.durationSemesters,
        docente: "Não atribuído",
        status: curso.isActive ? "Ativo" : "Inativo",
      }));

      setCursos(cursosFormatados);

      setNovoCurso({
        nome: "",
        modalidade: "",
        semestres: "1",
        cargaHoraria: "1",
        docente: "",
      });

      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar curso:", error);
      showToast.error(
        "Erro ao cadastrar curso",
        "Não foi possível incluir o curso.",
      );
    }
  }

  async function handleDeleteCurso() {
    if (!selectedCurso) return;

    try {
      await deleteCourse(selectedCurso.id);
      showToast.success(
        "Curso desativado",
        "Curso desativado com sucesso",
      );


      const data = await getCourses();

      const cursosFormatados: Curso[] = data.map((curso: Course) => ({
        id: curso.id,
        nome: curso.name,
        modalidade:
          curso.modality === "in_person"
            ? "Presencial"
            : curso.modality === "online"
              ? "EAD"
              : "Híbrido",
        cargaHoraria: curso.workloadHours,
        semestres: curso.durationSemesters,
        docente: "Não atribuído",
        status: curso.isActive ? "Ativo" : "Inativo",
      }));

      setCursos(cursosFormatados);
      setOpenDelete(false);
      setSelectedCurso(null);
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      showToast.error(
        "Erro ao excluir curso",
        "Não foi possível excluir o curso.",
      );
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Cursos
        </h2>

        {/* BUSCA E BOTÃO */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <Input
              placeholder="Buscar por nome ou modalidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 bg-white dark:bg-[#242424] dark:text-white"
            />
          </div>

          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-blue-900 cursor-pointer hover:brightness-115
               dark:bg-[#242424] dark:hover:bg-[#303030]
               dark:text-[#D9A900] dark:border dark:border-[#363636]"
          >
            <Plus size={18} />
            <span>Cadastrar Curso</span>
          </Button>
        </div>

        {/* TABELA */}

        {/* TABELA */}
        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow className="dark:border-zinc-700">
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Nome
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Docente
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Modalidade
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Semestres
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Carga Horária
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold">
                Status
              </TableHead>
              <TableHead className="text-zinc-800 dark:text-white font-bold text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cursosFiltrados.map((curso) => (
              <TableRow
                key={curso.id}
                className="dark:border-zinc-700 dark:hover:bg-[#303030]"
              >
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.nome}
                </TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.docente}
                </TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.modalidade}
                </TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.semestres}
                </TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.cargaHoraria}
                </TableCell>
                <TableCell className="text-zinc-800 dark:text-white">
                  {curso.status}
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
                          setSelectedCurso(curso);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil size={10} />
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
                        <Trash size={10} />
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
              onClick={() => setOpenAdd(false)}
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
