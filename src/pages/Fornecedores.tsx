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
    Phone,
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

type Fornecedor = {
    id: number;
    empresa: string;
    responsavel: string;
    telefone: string;
    status: "Ativo" | "Inativo";
};

export default function Fornecedores(): JSX.Element {
    const navigate = useNavigate();

    const [fornecedores, setFornecedores] = useState<
        Fornecedor[]
    >([
        {
            id: 1,
            empresa: "Tech Solutions",
            responsavel: "Carlos Silva",
            telefone: "(11) 99999-9999",
            status: "Ativo",
        },
        {
            id: 2,
            empresa: "Office Paper",
            responsavel: "Mariana Souza",
            telefone: "(11) 98888-8888",
            status: "Ativo",
        },
    ]);

    const [selectedFornecedor, setSelectedFornecedor] =
        useState<Fornecedor | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoFornecedor, setNovoFornecedor] =
        useState({
            empresa: "",
            responsavel: "",
            telefone: "",
        });

    function handleAddFornecedor() {
        const novo: Fornecedor = {
            id: Date.now(),
            empresa: novoFornecedor.empresa,
            responsavel: novoFornecedor.responsavel,
            telefone: novoFornecedor.telefone,
            status: "Ativo",
        };

        setFornecedores((prev) => [...prev, novo]);

        setNovoFornecedor({
            empresa: "",
            responsavel: "",
            telefone: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteFornecedor() {
        if (!selectedFornecedor) return;

        setFornecedores((prev) =>
            prev.filter(
                (f) => f.id !== selectedFornecedor.id
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
                            active
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
                    Fornecedores
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
                        <span>Empresa</span>
                        <span>Responsável</span>
                        <span>Telefone</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {fornecedores.map((fornecedor) => (
                        <div
                            key={fornecedor.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>
                                {fornecedor.empresa}
                            </span>

                            <span>
                                {fornecedor.responsavel}
                            </span>

                            <span className="flex items-center gap-2">
                                <Phone size={14} />
                                {fornecedor.telefone}
                            </span>

                            <span
                                className={`font-medium ${
                                    fornecedor.status ===
                                    "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {fornecedor.status}
                            </span>

                            {/* AÇÕES */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedFornecedor(
                                            fornecedor
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

                                <button
                                    onClick={() => {
                                        setSelectedFornecedor(
                                            fornecedor
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

                                <button
                                    onClick={() => {
                                        setSelectedFornecedor(
                                            fornecedor
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
                            Adicionar Fornecedor
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Empresa</Label>

                            <Input
                                value={novoFornecedor.empresa}
                                onChange={(e) =>
                                    setNovoFornecedor({
                                        ...novoFornecedor,
                                        empresa:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Responsável</Label>

                            <Input
                                value={
                                    novoFornecedor.responsavel
                                }
                                onChange={(e) =>
                                    setNovoFornecedor({
                                        ...novoFornecedor,
                                        responsavel:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Telefone</Label>

                            <Input
                                value={novoFornecedor.telefone}
                                onChange={(e) =>
                                    setNovoFornecedor({
                                        ...novoFornecedor,
                                        telefone:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleAddFornecedor}
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
                            Visualizar Fornecedor
                        </DialogTitle>
                    </DialogHeader>

                    {selectedFornecedor && (
                        <div className="space-y-3">
                            <p>
                                <strong>Empresa:</strong>{" "}
                                {
                                    selectedFornecedor.empresa
                                }
                            </p>

                            <p>
                                <strong>
                                    Responsável:
                                </strong>{" "}
                                {
                                    selectedFornecedor.responsavel
                                }
                            </p>

                            <p>
                                <strong>Telefone:</strong>{" "}
                                {
                                    selectedFornecedor.telefone
                                }
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {
                                    selectedFornecedor.status
                                }
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
                            Editar Fornecedor
                        </DialogTitle>
                    </DialogHeader>

                    {selectedFornecedor && (
                        <div className="space-y-4">
                            <div>
                                <Label>Empresa</Label>

                                <Input
                                    value={
                                        selectedFornecedor.empresa
                                    }
                                    onChange={(e) =>
                                        setSelectedFornecedor({
                                            ...selectedFornecedor,
                                            empresa:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Responsável</Label>

                                <Input
                                    value={
                                        selectedFornecedor.responsavel
                                    }
                                    onChange={(e) =>
                                        setSelectedFornecedor({
                                            ...selectedFornecedor,
                                            responsavel:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Telefone</Label>

                                <Input
                                    value={
                                        selectedFornecedor.telefone
                                    }
                                    onChange={(e) =>
                                        setSelectedFornecedor({
                                            ...selectedFornecedor,
                                            telefone:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setFornecedores(
                                        (prev) =>
                                            prev.map((f) =>
                                                f.id ===
                                                selectedFornecedor.id
                                                    ? selectedFornecedor
                                                    : f
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
                            Excluir Fornecedor
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir este
                        fornecedor?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={
                                handleDeleteFornecedor
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