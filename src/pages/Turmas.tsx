import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Home,
    GraduationCap,
    FileText,
    BookOpen,
    Users,
    Truck,
    User,
    Pencil,
    Eye,
    Trash2,
    Plus,
    CalendarDays,
    CogIcon,
} from "lucide-react";

import type { JSX } from "react";

import Logo from "/src/assets/LOGO.svg";

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

type Turma = {
    id: number;
    nome: string;
    curso: string;
    periodo: string;
    status: "Ativo" | "Inativo";
};

export default function Turmas(): JSX.Element {
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<Turma[]>([
        {
            id: 1,
            nome: "ADS 2026 - A",
            curso: "ADS",
            periodo: "Noturno",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "ADM 2026 - B",
            curso: "Administração",
            periodo: "Matutino",
            status: "Ativo",
        },
    ]);

    const [selectedTurma, setSelectedTurma] =
        useState<Turma | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novaTurma, setNovaTurma] = useState({
        nome: "",
        curso: "",
        periodo: "",
    });

    function handleAddTurma() {
        const nova: Turma = {
            id: Date.now(),
            nome: novaTurma.nome,
            curso: novaTurma.curso,
            periodo: novaTurma.periodo,
            status: "Ativo",
        };

        setTurmas((prev) => [...prev, nova]);

        setNovaTurma({
            nome: "",
            curso: "",
            periodo: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteTurma() {
        if (!selectedTurma) return;

        setTurmas((prev) =>
            prev.filter((t) => t.id !== selectedTurma.id)
        );

        setOpenDelete(false);
    }

    return (
        <div className="flex h-screen bg-zinc-100">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r flex flex-col justify-between">
                <div>
                    <div className="p-6 flex items-center justify-center">
                        <img
                            src={Logo}
                            alt="LOGO"
                            className="w-35"
                        />
                    </div>

                    <nav className="p-4 space-y-2">
                        <MenuItem
                            icon={<CogIcon size={18} />}
                            label="Configuracoes"
                            onClick={() => navigate("/configs")}
                        />
                        <MenuItem
                            icon={<Home size={18} />}
                            label="Home"
                            onClick={() => navigate("/home")}
                        />

                        <MenuItem
                            icon={
                                <GraduationCap size={18} />
                            }
                            label="Alunos"
                            onClick={() =>
                                navigate("/alunos")
                            }
                        />

                        <MenuItem
                            icon={<FileText size={18} />}
                            label="Docentes"
                            onClick={() =>
                                navigate("/docentes")
                            }
                        />

                        <MenuItem
                            icon={<BookOpen size={18} />}
                            label="Cursos"
                            onClick={() =>
                                navigate("/cursos")
                            }
                        />

                        <MenuItem
                            icon={<Users size={18} />}
                            label="Turmas"
                            onClick={() =>
                                navigate("/turmas")
                            }
                            active
                        />

                        <MenuItem
                            icon={<Truck size={18} />}
                            label="Fornecedores"
                            onClick={() =>
                                navigate("/fornecedores")
                            }
                        />

                        <MenuItem
                            icon={<User size={18} />}
                            label="Usuários"
                            onClick={() =>
                                navigate("/usuarios")
                            }
                        />
                    </nav>
                </div>

                <div className="p-4 border-t">
                    <p className="font-semibold text-sm">
                        John Doe
                    </p>

                    <p className="text-xs text-gray-500">
                        johndoe@instituicao.com.br
                    </p>
                </div>
            </aside>

            {/* CONTEÚDO */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Turmas
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
                        <span>Turma</span>
                        <span>Curso</span>
                        <span>Período</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {turmas.map((turma) => (
                        <div
                            key={turma.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{turma.nome}</span>

                            <span>{turma.curso}</span>

                            <span className="flex items-center gap-2">
                                <CalendarDays size={14} />
                                {turma.periodo}
                            </span>

                            <span
                                className={`font-medium ${
                                    turma.status ===
                                    "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {turma.status}
                            </span>

                            {/* AÇÕES */}
                            <div className="flex gap-2">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {
                                        setSelectedTurma(
                                            turma
                                        );
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
                                        setSelectedTurma(
                                            turma
                                        );
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
                                        setSelectedTurma(
                                            turma
                                        );
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
                            Adicionar Turma
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome da Turma</Label>

                            <Input
                                value={novaTurma.nome}
                                onChange={(e) =>
                                    setNovaTurma({
                                        ...novaTurma,
                                        nome:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Curso</Label>

                            <Input
                                value={novaTurma.curso}
                                onChange={(e) =>
                                    setNovaTurma({
                                        ...novaTurma,
                                        curso:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Período</Label>

                            <Input
                                value={novaTurma.periodo}
                                onChange={(e) =>
                                    setNovaTurma({
                                        ...novaTurma,
                                        periodo:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleAddTurma}>
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
                            Visualizar Turma
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTurma && (
                        <div className="space-y-3">
                            <p>
                                <strong>Turma:</strong>{" "}
                                {selectedTurma.nome}
                            </p>

                            <p>
                                <strong>Curso:</strong>{" "}
                                {selectedTurma.curso}
                            </p>

                            <p>
                                <strong>Período:</strong>{" "}
                                {selectedTurma.periodo}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedTurma.status}
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
                            Editar Turma
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTurma && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nome</Label>

                                <Input
                                    value={
                                        selectedTurma.nome
                                    }
                                    onChange={(e) =>
                                        setSelectedTurma({
                                            ...selectedTurma,
                                            nome:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Curso</Label>

                                <Input
                                    value={
                                        selectedTurma.curso
                                    }
                                    onChange={(e) =>
                                        setSelectedTurma({
                                            ...selectedTurma,
                                            curso:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Período</Label>

                                <Input
                                    value={
                                        selectedTurma.periodo
                                    }
                                    onChange={(e) =>
                                        setSelectedTurma({
                                            ...selectedTurma,
                                            periodo:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setTurmas((prev) =>
                                        prev.map((t) =>
                                            t.id ===
                                            selectedTurma.id
                                                ? selectedTurma
                                                : t
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
                            Excluir Turma
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir esta
                        turma?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteTurma}
                        >
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function MenuItem({
    icon,
    label,
    active = false,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${
          active
              ? "bg-zinc-200 font-semibold"
              : "hover:bg-zinc-100 text-zinc-700"
      }`}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}