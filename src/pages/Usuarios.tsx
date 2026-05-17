import { useState } from "react";
import {
    Pencil,
    Eye,
    Trash2,
    Plus
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
type Usuario = {
    id: number;
    nome: string;
    setor: string;
    acesso: string;
    status: "Ativo" | "Inativo";
};

export default function Usuarios(): JSX.Element {
    const [usuarios, setUsuarios] = useState<Usuario[]>([
        {
            id: 1,
            nome: "REGISTRO",
            setor: "TI",
            acesso: "09h03",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "REGISTRO",
            setor: "Secretaria",
            acesso: "09h03",
            status: "Ativo",
        },
    ]);

    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        setor: "",
    });

    function handleAddUser() {
        const novo: Usuario = {
            id: Date.now(),
            nome: novoUsuario.nome,
            setor: novoUsuario.setor,
            acesso: "00h00",
            status: "Ativo",
        };

        setUsuarios((prev) => [...prev, novo]);

        setNovoUsuario({
            nome: "",
            setor: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteUser() {
        if (!selectedUser) return;

        setUsuarios((prev) =>
            prev.filter((u) => u.id !== selectedUser.id)
        );

        setOpenDelete(false);
    }

    return (
        <div className="flex h-screen bg-zinc-100">

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
                        <span>Setor</span>
                        <span>Último Acesso</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {usuarios.map((usuario) => (
                        <div
                            key={usuario.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{usuario.nome}</span>

                            <span>{usuario.setor}</span>

                            <span>
                                dd/mm/aaaa - {usuario.acesso}
                            </span>

                            <span
                                className={`font-medium ${usuario.status === "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                            >
                                {usuario.status}
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
                                <strong>Setor:</strong>{" "}
                                {selectedUser.setor}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedUser.status}
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
                                <Label>Setor</Label>

                                <Input
                                    value={selectedUser.setor}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            setor: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setUsuarios((prev) =>
                                        prev.map((u) =>
                                            u.id === selectedUser.id
                                                ? selectedUser
                                                : u
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