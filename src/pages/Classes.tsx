import { useEffect, useState } from "react";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  type Class,
} from "@/services/classService";
import { getCourses, type Course } from "@/services/courseService";
import { getTeachers, type Teacher } from "@/services/teacherService";
import { Pencil, Plus, Trash, MoreHorizontalIcon } from "lucide-react";
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

const NOVA_TURMA_INICIAL: TurmaFormValues = {
  courseId: "",
  teacherId: "",
  description: "",
  semester: "1",
  year: new Date().getFullYear(),
  scheduleTime: "",
  room: "",
};

export default function Classes(): JSX.Element {
  const [turmas, setTurmas] = useState<Class[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<Class | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [novaTurma, setNovaTurma] =
    useState<TurmaFormValues>(NOVA_TURMA_INICIAL);

  const [editTurma, setEditTurma] =
    useState<TurmaFormValues>(NOVA_TURMA_INICIAL);

  // Somente cursos ativos podem ser selecionados.
  const activeCourses = courses.filter((course) => course.isActive);

  // Somente docentes ativos podem ser selecionados.
  const activeTeachers = teachers.filter((teacher) => teacher.isActive);

  useEffect(() => {
    let ignore = false;

    async function loadClasses() {
      try {
        const [classesData, coursesData, teachersData] = await Promise.all([
          getClasses(),
          getCourses(),
          getTeachers(),
        ]);

        if (ignore) return;

        setTurmas(classesData);
        setCourses(coursesData);
        setTeachers(teachersData);
      } catch (error) {
        if (!ignore) {
          console.error("Erro ao carregar dados das turmas:", error);
        }
      }
    }

    void loadClasses();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddTurma() {
    try {
      if (!novaTurma.courseId) {
        alert("Selecione um curso para cadastrar a turma.");
        return;
      }

      if (!activeCourses.some((course) => course.id === novaTurma.courseId)) {
        alert("O curso selecionado não está ativo.");
        return;
      }

      if (!novaTurma.description.trim()) {
        alert("Informe a descrição da turma.");
        return;
      }

      await createClass({
        ...novaTurma,
        teacherId: novaTurma.teacherId || null,
        description: novaTurma.description.trim(),
      });

      const classesData = await getClasses();
      setTurmas(classesData);

      setNovaTurma(NOVA_TURMA_INICIAL);
      setOpenAdd(false);
    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
      alert("Não foi possível cadastrar a turma.");
    }
  }

  async function handleEditTurma() {
    if (!selectedTurma) return;

    try {
      if (!editTurma.courseId) {
        alert("Selecione um curso para atualizar a turma.");
        return;
      }

      if (!activeCourses.some((course) => course.id === editTurma.courseId)) {
        alert("Selecione um curso ativo para atualizar a turma.");
        return;
      }

      if (!editTurma.description.trim()) {
        alert("Informe a descrição da turma.");
        return;
      }

      await updateClass(selectedTurma.id, {
        ...editTurma,
        teacherId: editTurma.teacherId || null,
        description: editTurma.description.trim(),
        status: selectedTurma.status,
        isActive: selectedTurma.isActive,
      });

      const classesData = await getClasses();
      setTurmas(classesData);

      setOpenEdit(false);
      setSelectedTurma(null);
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      alert("Não foi possível atualizar a turma.");
    }
  }

  async function handleDeleteTurma() {
    if (!selectedTurma) return;

    try {
      await deleteClass(selectedTurma.id);

      const classesData = await getClasses();
      setTurmas(classesData);

      setOpenDelete(false);
      setSelectedTurma(null);
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      alert("Não foi possível excluir a turma.");
    }
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-[#181818]">
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Turmas
        </h2>

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

        <Table className="bg-white dark:bg-[#242424] p-3 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Nome
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Curso
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Docente vinculado
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Semestre
              </TableHead>

              <TableHead className="text-zinc-800 font-bold dark:text-white">
                Horário
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
            {turmas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500 dark:text-zinc-400"
                >
                  Nenhuma turma encontrada.
                </TableCell>
              </TableRow>
            ) : (
              turmas.map((turma) => (
                <TableRow
                  key={turma.id}
                  className="dark:border-zinc-700 dark:hover:bg-[#303030]"
                >
                  <TableCell className="text-zinc-800 dark:text-white">
                    {turma.description}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {courses.find((course) => course.id === turma.courseId)
                      ?.name ?? "Curso não encontrado"}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {turma.teacherId
                      ? (teachers.find(
                          (teacher) => teacher.id === turma.teacherId,
                        )?.name ?? "Docente não encontrado")
                      : "Não atribuído"}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {turma.semester}º semestre / {turma.year}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {turma.scheduleTime.slice(0, 5)}
                  </TableCell>

                  <TableCell className="text-zinc-800 dark:text-white">
                    {!turma.isActive
                      ? "Inativa"
                      : {
                          planned: "Planejada",
                          in_progress: "Em andamento",
                          completed: "Concluída",
                          cancelled: "Cancelada",
                        }[turma.status]}
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
                            setSelectedTurma(turma);

                            setEditTurma({
                              courseId: turma.courseId,
                              teacherId: turma.teacherId ?? "",
                              description: turma.description,
                              semester: turma.semester,
                              year: turma.year,
                              scheduleTime: turma.scheduleTime.slice(0, 5),
                              room: turma.room,
                            });

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
              ))
            )}
          </TableBody>
        </Table>
      </main>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Cadastrar Turma
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os campos para cadastrar uma turma.
            </DialogDescription>
          </DialogHeader>
          <TurmaFormFields
            courses={activeCourses}
            teachers={activeTeachers}
            values={novaTurma}
            onChange={(field, value) =>
              setNovaTurma((prev) => ({ ...prev, [field]: value }))
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
            <Button
              onClick={handleAddTurma}
              className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]"
            >
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Editar Turma</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Altere os campos desejados e salve.
            </DialogDescription>
          </DialogHeader>
          {selectedTurma && (
            <TurmaFormFields
              courses={activeCourses}
              teachers={activeTeachers}
              values={editTurma}
              onChange={(field, value) =>
                setEditTurma((prev) => ({
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
              className="dark:bg-[#303030] dark:text-white dark:border-[#363636] dark:hover:bg-[#383838]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditTurma}
              className="dark:bg-[#303030] dark:text-[#D9A900] dark:border dark:border-[#363636] dark:hover:bg-[#383838]"
            >
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="dark:bg-[#242424] dark:border-[#363636] dark:text-white">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Excluir Turma</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-800 dark:text-white">
            Deseja realmente excluir esta turma?
          </p>
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
  courseId: string;
  teacherId: string;
  description: string;
  semester: "1" | "2";
  year: number;
  scheduleTime: string;
  room: string;
};

function TurmaFormFields({
  values,
  courses,
  teachers,
  onChange,
}: {
  values: TurmaFormValues;
  courses: Course[];
  teachers: Teacher[];
  onChange: (field: keyof TurmaFormValues, value: string | number) => void;
}) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="dark:text-white" htmlFor="course">
          Curso
        </FieldLabel>
        <Select
          value={values.courseId}
          onValueChange={(value) => onChange("courseId", value)}
        >
          <SelectTrigger id="course">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="teacher">
          Docente vinculado
        </FieldLabel>
        <Select
          value={values.teacherId || "none"}
          onValueChange={(value) =>
            onChange("teacherId", value === "none" ? "" : value)
          }
        >
          <SelectTrigger id="teacher">
            <SelectValue placeholder="Selecione um docente" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">Não vincular docente</SelectItem>

              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="description">
          Descrição
        </FieldLabel>
        <Input
          id="description"
          autoComplete="off"
          placeholder="TSI - Período Noturno"
          required
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="semester">
          Semestre
        </FieldLabel>
        <Select
          value={values.semester}
          onValueChange={(value) => onChange("semester", value as "1" | "2")}
        >
          <SelectTrigger id="semester">
            <SelectValue placeholder="Selecione o semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1º semestre</SelectItem>
            <SelectItem value="2">2º semestre</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="year">
          Ano letivo
        </FieldLabel>
        <Input
          id="year"
          type="number"
          required
          min={2000}
          max={2100}
          value={values.year}
          onChange={(e) => onChange("year", Number(e.target.value))}
        />
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="scheduleTime">
          Horário
        </FieldLabel>
        <Input
          id="scheduleTime"
          type="time"
          required
          value={values.scheduleTime}
          onChange={(e) => onChange("scheduleTime", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel className="dark:text-white" htmlFor="room">
          Sala
        </FieldLabel>
        <Input
          id="room"
          autoComplete="off"
          placeholder="Sala 101"
          required
          value={values.room}
          onChange={(e) => onChange("room", e.target.value)}
        />
      </Field>
    </div>
  );
}
