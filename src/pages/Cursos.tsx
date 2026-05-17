import { useState } from "react";
import {
    Pencil,
    Eye,
    Trash2,
    Plus,
    Clock
} from "lucide-react";
import type { JSX } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Curso = {
    id: number;
    nome: string;
    coordenador: string;
    cargaHoraria: string;
    status: "Ativo" | "Inativo";
};

export default function Cursos(): JSX.Element {
    const [cursos, setCursos] = useState<Curso[]>([
        {
            id: 1,
            nome: "Análise e Desenvolvimento de Sistemas",
            coordenador: "João Silva",
            cargaHoraria: "2400h",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "Administração",
            coordenador: "Maria Souza",
            cargaHoraria: "3000h",
            status: "Ativo",
        },
    ]);

    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoCurso, setNovoCurso] = useState({
        nome: "",
        coordenador: "",
        cargaHoraria: "",
    });

    function handleAddCurso() {
        const novo: Curso = {
            id: Date.now(),
            nome: novoCurso.nome,
            coordenador: novoCurso.coordenador,
            cargaHoraria: novoCurso.cargaHoraria,
            status: "Ativo",
        };

        setCursos((prev) => [...prev, novo]);

        setNovoCurso({
            nome: "",
            coordenador: "",
            cargaHoraria: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteCurso() {
        if (!selectedCurso) return;

        setCursos((prev) =>
            prev.filter((c) => c.id !== selectedCurso.id)
        );

        setOpenDelete(false);
    }

    return (
        <div className="flex h-screen bg-zinc-100">
            {/* CONTEÚDO */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Cursos
                </h2>

                {/* BOTÃO */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-md transition"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* TABELA */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="grid grid-cols-5 bg-zinc-50 p-4 font-semibold text-sm">
                        <span>Curso</span>
                        <span>Coordenador</span>
                        <span>Carga Horária</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {cursos.map((curso) => (
                        <div
                            key={curso.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{curso.nome}</span>

                            <span>{curso.coordenador}</span>

                            <span className="flex items-center gap-2">
                                <Clock size={14} />
                                {curso.cargaHoraria}
                            </span>

                            <span
                                className={`font-medium ${
                                    curso.status === "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {curso.status}
                            </span>

                            <div className="flex gap-2">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {
                                        setSelectedCurso(curso);
                                        setOpenEdit(true);
                                    }}
                                    className="bg-blue-100 p-2 rounded"
                                >
                                    <Pencil
                                        size={14}
                                        className="text-blue-600"
                                    />
                                </button>

                                {/* VISUALIZAR */}
                                <button
                                    onClick={() => {
                                        setSelectedCurso(curso);
                                        setOpenView(true);
                                    }}
                                    className="bg-yellow-100 p-2 rounded"
                                >
                                    <Eye
                                        size={14}
                                        className="text-yellow-600"
                                    />
                                </button>

                                {/* EXCLUIR */}
                                <button
                                    onClick={() => {
                                        setSelectedCurso(curso);
                                        setOpenDelete(true);
                                    }}
                                    className="bg-red-100 p-2 rounded"
                                >
                                    <Trash2
                                        size={14}
                                        className="text-red-600"
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* MODAL ADICIONAR */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Adicionar Curso
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome do Curso</Label>

                            <Input
                                value={novoCurso.nome}
                                onChange={(e) =>
                                    setNovoCurso({
                                        ...novoCurso,
                                        nome: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Coordenador</Label>

                            <Input
                                value={novoCurso.coordenador}
                                onChange={(e) =>
                                    setNovoCurso({
                                        ...novoCurso,
                                        coordenador: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Carga Horária</Label>

                            <Input
                                value={novoCurso.cargaHoraria}
                                onChange={(e) =>
                                    setNovoCurso({
                                        ...novoCurso,
                                        cargaHoraria: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleAddCurso}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL VISUALIZAR */}
            <Dialog open={openView} onOpenChange={setOpenView}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Visualizar Curso
                        </DialogTitle>
                    </DialogHeader>

                    {selectedCurso && (
                        <div className="space-y-3">
                            <p>
                                <strong>Curso:</strong>{" "}
                                {selectedCurso.nome}
                            </p>

                            <p>
                                <strong>Coordenador:</strong>{" "}
                                {selectedCurso.coordenador}
                            </p>

                            <p>
                                <strong>Carga Horária:</strong>{" "}
                                {selectedCurso.cargaHoraria}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedCurso.status}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL EDITAR */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Editar Curso
                        </DialogTitle>
                    </DialogHeader>

                    {selectedCurso && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nome</Label>

                                <Input
                                    value={selectedCurso.nome}
                                    onChange={(e) =>
                                        setSelectedCurso({
                                            ...selectedCurso,
                                            nome: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Coordenador</Label>

                                <Input
                                    value={selectedCurso.coordenador}
                                    onChange={(e) =>
                                        setSelectedCurso({
                                            ...selectedCurso,
                                            coordenador:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Carga Horária</Label>

                                <Input
                                    value={
                                        selectedCurso.cargaHoraria
                                    }
                                    onChange={(e) =>
                                        setSelectedCurso({
                                            ...selectedCurso,
                                            cargaHoraria:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setCursos((prev) =>
                                        prev.map((c) =>
                                            c.id === selectedCurso.id
                                                ? selectedCurso
                                                : c
                                        )
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
            <Dialog
                open={openDelete}
                onOpenChange={setOpenDelete}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Excluir Curso
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir este curso?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCurso}
                        >
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}