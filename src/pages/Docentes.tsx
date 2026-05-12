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
    Mail,
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

type Docente = {
    id: number;
    nome: string;
    disciplina: string;
    email: string;
    status: "Ativo" | "Inativo";
};

export default function Docentes(): JSX.Element {
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState<Docente[]>([
        {
            id: 1,
            nome: "Carlos Henrique",
            disciplina: "Banco de Dados",
            email: "carlos@faculdade.com",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "Fernanda Souza",
            disciplina: "Matemática",
            email: "fernanda@faculdade.com",
            status: "Ativo",
        },
    ]);

    const [selectedDocente, setSelectedDocente] =
        useState<Docente | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoDocente, setNovoDocente] = useState({
        nome: "",
        disciplina: "",
        email: "",
    });

    function handleAddDocente() {
        const novo: Docente = {
            id: Date.now(),
            nome: novoDocente.nome,
            disciplina: novoDocente.disciplina,
            email: novoDocente.email,
            status: "Ativo",
        };

        setDocentes((prev) => [...prev, novo]);

        setNovoDocente({
            nome: "",
            disciplina: "",
            email: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteDocente() {
        if (!selectedDocente) return;

        setDocentes((prev) =>
            prev.filter(
                (d) => d.id !== selectedDocente.id
            )
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
                            active
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
                    Docentes
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
                        <span>Nome</span>
                        <span>Disciplina</span>
                        <span>Email</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {docentes.map((docente) => (
                        <div
                            key={docente.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{docente.nome}</span>

                            <span>
                                {docente.disciplina}
                            </span>

                            <span className="flex items-center gap-2">
                                <Mail size={14} />
                                {docente.email}
                            </span>

                            <span
                                className={`font-medium ${
                                    docente.status ===
                                    "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {docente.status}
                            </span>

                            {/* AÇÕES */}
                            <div className="flex gap-2">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {
                                        setSelectedDocente(
                                            docente
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
                                        setSelectedDocente(
                                            docente
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
                                        setSelectedDocente(
                                            docente
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
                            Adicionar Docente
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome</Label>

                            <Input
                                value={novoDocente.nome}
                                onChange={(e) =>
                                    setNovoDocente({
                                        ...novoDocente,
                                        nome:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Disciplina</Label>

                            <Input
                                value={
                                    novoDocente.disciplina
                                }
                                onChange={(e) =>
                                    setNovoDocente({
                                        ...novoDocente,
                                        disciplina:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>

                            <Input
                                value={novoDocente.email}
                                onChange={(e) =>
                                    setNovoDocente({
                                        ...novoDocente,
                                        email:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleAddDocente}
                        >
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
                            Visualizar Docente
                        </DialogTitle>
                    </DialogHeader>

                    {selectedDocente && (
                        <div className="space-y-3">
                            <p>
                                <strong>Nome:</strong>{" "}
                                {selectedDocente.nome}
                            </p>

                            <p>
                                <strong>
                                    Disciplina:
                                </strong>{" "}
                                {
                                    selectedDocente.disciplina
                                }
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedDocente.email}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedDocente.status}
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
                            Editar Docente
                        </DialogTitle>
                    </DialogHeader>

                    {selectedDocente && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nome</Label>

                                <Input
                                    value={
                                        selectedDocente.nome
                                    }
                                    onChange={(e) =>
                                        setSelectedDocente({
                                            ...selectedDocente,
                                            nome:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Disciplina</Label>

                                <Input
                                    value={
                                        selectedDocente.disciplina
                                    }
                                    onChange={(e) =>
                                        setSelectedDocente({
                                            ...selectedDocente,
                                            disciplina:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Email</Label>

                                <Input
                                    value={
                                        selectedDocente.email
                                    }
                                    onChange={(e) =>
                                        setSelectedDocente({
                                            ...selectedDocente,
                                            email:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setDocentes((prev) =>
                                        prev.map((d) =>
                                            d.id ===
                                            selectedDocente.id
                                                ? selectedDocente
                                                : d
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
                            Excluir Docente
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir este
                        docente?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={
                                handleDeleteDocente
                            }
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