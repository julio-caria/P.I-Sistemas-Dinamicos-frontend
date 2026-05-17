import { useEffect, useState } from "react";
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
    CogIcon,
} from "lucide-react";

import type { JSX } from "react";

import Logo from "/src/assets/LOGO.svg";

import { api } from "@/services/api";

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

type Usuario = {
    id: string;
    nome: string;
    email?: string;
    setor?: string;
    acesso?: string;
    status?: "Ativo" | "Inativo";
};

export default function Usuarios(): JSX.Element {
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        email: "",
        senha: "",
        setor: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await api.get("/api/users");

            setUsuarios(response.data);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
        }
    }

    async function handleAddUser() {
        try {
            await api.post("/api/users", {
                name: novoUsuario.nome,
                email: novoUsuario.email,
                password: novoUsuario.senha,
            });

            await fetchUsers();

            setNovoUsuario({
                nome: "",
                email: "",
                senha: "",
                setor: "",
            });

            setOpenAdd(false);

        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err);
        }
    }

    async function handleDeleteUser() {
        if (!selectedUser) return;

        try {
            await api.delete(`/api/users/${selectedUser.id}`);

            await fetchUsers();

            setOpenDelete(false);

        } catch (err) {
            console.error(err);
        }
    }

    async function handleUpdateUser() {
        if (!selectedUser) return;

        try {
            await api.put(`/api/users/${selectedUser.id}`, {
                name: selectedUser.nome,
                email: selectedUser.email,
            });

            await fetchUsers();

            setOpenEdit(false);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex h-screen bg-zinc-100">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r flex flex-col justify-between">
                <div>
                    {/* LOGO */}
                    <div className="p-6 flex items-center justify-center">
                        <img src={Logo} alt="LOGO" className="w-35" />
                    </div>

                    {/* MENU */}
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
                            icon={<GraduationCap size={18} />}
                            label="Alunos"
                            onClick={() => navigate("/alunos")}
                        />

                        <MenuItem
                            icon={<FileText size={18} />}
                            label="Docentes"
                            onClick={() => navigate("/docentes")}
                        />

                        <MenuItem
                            icon={<BookOpen size={18} />}
                            label="Cursos"
                            onClick={() => navigate("/cursos")}
                        />

                        <MenuItem
                            icon={<Users size={18} />}
                            label="Turmas"
                            onClick={() => navigate("/turmas")}
                        />

                        <MenuItem
                            icon={<Truck size={18} />}
                            label="Fornecedores"
                            onClick={() => navigate("/fornecedores")}
                        />

                        <MenuItem
                            icon={<User size={18} />}
                            label="Usuários"
                            onClick={() => navigate("/usuarios")}
                            active
                        />
                    </nav>
                </div>

                {/* USER */}
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
                    Usuários
                </h2>

                {/* BOTÃO ADICIONAR */}
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
                        <span>Usuário</span>
                        <span>Email</span>
                        <span>Setor</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {usuarios.map((usuario) => (
                        <div
                            key={usuario.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{usuario.nome}</span>

                            <span>{usuario.email}</span>

                            <span>
                                {usuario.setor || "-"}
                            </span>

                            <span
                                className={`font-medium ${usuario.status === "Inativo"
                                    ? "text-red-500"
                                    : "text-green-600"
                                    }`}
                            >
                                {usuario.status || "Ativo"}
                            </span>

                            {/* AÇÕES */}
                            <div className="flex gap-2">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {
                                        setSelectedUser(usuario);
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
                                        setSelectedUser(usuario);
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
                                        setSelectedUser(usuario);
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
                            Adicionar Usuário
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome</Label>

                            <Input
                                value={novoUsuario.nome}
                                onChange={(e) =>
                                    setNovoUsuario({
                                        ...novoUsuario,
                                        nome: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>

                            <Input
                                type="email"
                                value={novoUsuario.email}
                                onChange={(e) =>
                                    setNovoUsuario({
                                        ...novoUsuario,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Senha</Label>

                            <Input
                                type="password"
                                value={novoUsuario.senha}
                                onChange={(e) =>
                                    setNovoUsuario({
                                        ...novoUsuario,
                                        senha: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Setor</Label>

                            <Input
                                value={novoUsuario.setor}
                                onChange={(e) =>
                                    setNovoUsuario({
                                        ...novoUsuario,
                                        setor: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleAddUser}>
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
                            Visualizar Usuário
                        </DialogTitle>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-3">
                            <p>
                                <strong>Nome:</strong>{" "}
                                {selectedUser.nome}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedUser.email}
                            </p>

                            <p>
                                <strong>Setor:</strong>{" "}
                                {selectedUser.setor || "-"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedUser.status || "Ativo"}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL EDITAR */}
            {/* MODAL EDITAR */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Editar Usuário
                        </DialogTitle>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nome</Label>

                                <Input
                                    value={selectedUser.nome}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            nome: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Email</Label>

                                <Input
                                    type="email"
                                    value={selectedUser.email || ""}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Button onClick={handleUpdateUser}>
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
                        <DialogTitle>
                            Excluir Usuário
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir este usuário?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
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
            ${active
                    ? "bg-zinc-200 font-semibold"
                    : "hover:bg-zinc-100 text-zinc-700"
                }`}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}