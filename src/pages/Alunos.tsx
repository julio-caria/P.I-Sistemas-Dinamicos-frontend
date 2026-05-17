import { useState } from "react";
import {
    Pencil,
    Eye,
    Trash2,
    Plus,
    Mail,
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

type Aluno = {
    id: number;
    nome: string;
    curso: string;
    email: string;
    status: "Ativo" | "Inativo";
};

export default function Alunos(): JSX.Element {
    const [alunos, setAlunos] = useState<Aluno[]>([
        {
            id: 1,
            nome: "João Gabriel",
            curso: "ADS",
            email: "joao@email.com",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "Maria Eduarda",
            curso: "Administração",
            email: "maria@email.com",
            status: "Ativo",
        },
    ]);

    const [selectedAluno, setSelectedAluno] =
        useState<Aluno | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [novoAluno, setNovoAluno] = useState({
        nome: "",
        curso: "",
        email: "",
    });

    function handleAddAluno() {
        const novo: Aluno = {
            id: Date.now(),
            nome: novoAluno.nome,
            curso: novoAluno.curso,
            email: novoAluno.email,
            status: "Ativo",
        };

        setAlunos((prev) => [...prev, novo]);

        setNovoAluno({
            nome: "",
            curso: "",
            email: "",
        });

        setOpenAdd(false);
    }

    function handleDeleteAluno() {
        if (!selectedAluno) return;

        setAlunos((prev) =>
            prev.filter((a) => a.id !== selectedAluno.id)
        );

        setOpenDelete(false);
    }

    return (
        <div className="flex h-screen bg-zinc-100">
            {/* CONTEÚDO */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Alunos
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
                        <span>Curso</span>
                        <span>Email</span>
                        <span>Status</span>
                        <span>Ação</span>
                    </div>

                    {alunos.map((aluno) => (
                        <div
                            key={aluno.id}
                            className="grid grid-cols-5 p-4 border-t text-sm items-center"
                        >
                            <span>{aluno.nome}</span>

                            <span>{aluno.curso}</span>

                            <span className="flex items-center gap-2">
                                <Mail size={14} />
                                {aluno.email}
                            </span>

                            <span
                                className={`font-medium ${
                                    aluno.status ===
                                    "Ativo"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {aluno.status}
                            </span>

                            {/* AÇÕES */}
                            <div className="flex gap-2">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {
                                        setSelectedAluno(
                                            aluno
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
                                        setSelectedAluno(
                                            aluno
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
                                        setSelectedAluno(
                                            aluno
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
                            Adicionar Aluno
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome</Label>

                            <Input
                                value={novoAluno.nome}
                                onChange={(e) =>
                                    setNovoAluno({
                                        ...novoAluno,
                                        nome:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Curso</Label>

                            <Input
                                value={novoAluno.curso}
                                onChange={(e) =>
                                    setNovoAluno({
                                        ...novoAluno,
                                        curso:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>

                            <Input
                                value={novoAluno.email}
                                onChange={(e) =>
                                    setNovoAluno({
                                        ...novoAluno,
                                        email:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleAddAluno}>
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
                            Visualizar Aluno
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAluno && (
                        <div className="space-y-3">
                            <p>
                                <strong>Nome:</strong>{" "}
                                {selectedAluno.nome}
                            </p>

                            <p>
                                <strong>Curso:</strong>{" "}
                                {selectedAluno.curso}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedAluno.email}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedAluno.status}
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
                            Editar Aluno
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAluno && (
                        <div className="space-y-4">
                            <div>
                                <Label>Nome</Label>

                                <Input
                                    value={
                                        selectedAluno.nome
                                    }
                                    onChange={(e) =>
                                        setSelectedAluno({
                                            ...selectedAluno,
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
                                        selectedAluno.curso
                                    }
                                    onChange={(e) =>
                                        setSelectedAluno({
                                            ...selectedAluno,
                                            curso:
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
                                        selectedAluno.email
                                    }
                                    onChange={(e) =>
                                        setSelectedAluno({
                                            ...selectedAluno,
                                            email:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    setAlunos((prev) =>
                                        prev.map((a) =>
                                            a.id ===
                                            selectedAluno.id
                                                ? selectedAluno
                                                : a
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
                            Excluir Aluno
                        </DialogTitle>
                    </DialogHeader>

                    <p>
                        Deseja realmente excluir este
                        aluno?
                    </p>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAluno}
                        >
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}