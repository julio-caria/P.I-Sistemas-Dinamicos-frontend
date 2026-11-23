
import React, { type JSX, useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";

// Ajuste o caminho conforme a localização do seu arquivo apiFetch.
import { apiFetch } from "@/services/api";

// TIPOS DOS DADOS DA API

type Student = {
    id: string;
};

type Teacher = {
    id: string;
    name: string;
    degreeLevel:
    | "undergraduate"
    | "specialization"
    | "master"
    | "doctorate";
};

type Class = {
    id: string;
    teacherId: string | null;
    description: string;
    semester: "1" | "2";
    year: number;
    status:
    | "planned"
    | "in_progress"
    | "completed"
    | "cancelled";
    isActive: boolean;
};

type DashboardData = {
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
};

// TRADUÇÕES

const DEGREE_LABELS: Record<string, string> = {
    undergraduate: "Graduação",
    specialization: "Especialização",
    master: "Mestrado",
    doctorate: "Doutorado",
};

const STATUS_LABELS: Record<string, string> = {
    planned: "Planejadas",
    in_progress: "Em andamento",
    completed: "Concluídas",
    cancelled: "Canceladas",
};

const DEGREE_LEVELS = [
    "undergraduate",
    "specialization",
    "master",
    "doctorate",
];

const CLASS_STATUSES = [
    "planned",
    "in_progress",
    "completed",
    "cancelled",
];

const COLORS = [
    "#7FB3D5",
    "#82E0AA",
    "#F8C471",
    "#F1948A",
];

const formatNumber = (value: number) =>
    new Intl.NumberFormat("pt-BR").format(value);

// COMPONENTE PRINCIPAL

export default function Home(): JSX.Element {
    const [dashboard, setDashboard] = useState<DashboardData>({
        students: [],
        teachers: [],
        classes: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(0);

    // BUSCAR DADOS DA API

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError(null);

                const [
                    studentsResponse,
                    teachersResponse,
                    classesResponse,
                ] = await Promise.all([
                    apiFetch("/api/v1/students"),
                    apiFetch("/api/v1/teachers"),
                    apiFetch("/api/v1/classes"),
                ]);

                if (
                    !studentsResponse.ok ||
                    !teachersResponse.ok ||
                    !classesResponse.ok
                ) {
                    throw new Error(
                        "Não foi possível carregar os dados do Dashboard."
                    );
                }

                const studentsData = await studentsResponse.json();
                const teachersData = await teachersResponse.json();
                const classesData = await classesResponse.json();

                setDashboard({
                    students: studentsData.students,
                    teachers: teachersData,
                    classes: classesData,
                });

            } catch (err) {
                console.error("Erro ao carregar Dashboard:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Erro inesperado ao carregar o Dashboard."
                );

            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [reload]);

    // INDICADORES DOS CARDS

    const totalStudents = dashboard.students.length;
    const totalTeachers = dashboard.teachers.length;
    const totalClasses = dashboard.classes.length;

    // GRÁFICO 1: DOCENTES POR TITULAÇÃO

    const teachersByDegree = useMemo(() => {
        return DEGREE_LEVELS.map((degree) => ({
            name: DEGREE_LABELS[degree],
            value: dashboard.teachers.filter(
                (teacher) => teacher.degreeLevel === degree
            ).length,
        }));
    }, [dashboard.teachers]);

    // GRÁFICO 2: TURMAS POR SEMESTRE

    const classesByPeriod = useMemo(() => {
        const grouped = new Map<string, number>();

        dashboard.classes.forEach((item) => {
            const period = `${item.year}.${item.semester}`;

            grouped.set(
                period,
                (grouped.get(period) ?? 0) + 1
            );
        });

        return Array.from(grouped, ([periodo, total]) => ({
            periodo,
            total,
        })).sort((a, b) => {
            const [yearA, semesterA] = a.periodo.split(".").map(Number);
            const [yearB, semesterB] = b.periodo.split(".").map(Number);

            return yearA - yearB || semesterA - semesterB;
        });
    }, [dashboard.classes]);

    // GRÁFICO 3: SITUAÇÃO DAS TURMAS

    const classesByStatus = useMemo(() => {
        return CLASS_STATUSES.map((status) => ({
            name: STATUS_LABELS[status],
            value: dashboard.classes.filter(
                (item) => item.status === status
            ).length,
        }));
    }, [dashboard.classes]);

    // GRÁFICO 4: TURMAS POR DOCENTE

    const classesByTeacher = useMemo(() => {
        const teacherMap = new Map(
            dashboard.teachers.map((teacher) => [
                teacher.id,
                teacher.name,
            ])
        );

        const grouped = new Map<string, number>();

        dashboard.classes.forEach((item) => {
            const teacherName = item.teacherId
                ? teacherMap.get(item.teacherId) ?? "Docente não identificado"
                : "Sem docente atribuído";

            grouped.set(
                teacherName,
                (grouped.get(teacherName) ?? 0) + 1
            );
        });

        return Array.from(grouped, ([name, total]) => ({
            name,
            total,
        }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 8);
    }, [dashboard.classes, dashboard.teachers]);

    return (
        <div className="flex h-screen bg-zinc-100">

            {/* CONTEÚDO */}

            <main className="flex-1 p-10 overflow-auto">

                {/* TÍTULO */}

                <h1 className="text-3xl font-bold mb-6">
                    Dashboard
                </h1>

                {/* ERRO */}

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex justify-between items-center">
                        <span>{error}</span>

                        <button
                            onClick={() => setReload((prev) => prev + 1)}
                            className="font-semibold underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* TOP */}

                <div className="grid grid-cols-2 gap-4 mb-6">

                    {/* CARDS */}

                    <div className="grid grid-cols-3 gap-4 mb-6">

                        <DashboardCard
                            numero={
                                loading
                                    ? "..."
                                    : formatNumber(totalStudents)
                            }
                            texto="Alunos"
                            cor="bg-blue-100"
                        />

                        <DashboardCard
                            numero={
                                loading
                                    ? "..."
                                    : formatNumber(totalTeachers)
                            }
                            texto="Docentes"
                            cor="bg-green-100"
                        />

                        <DashboardCard
                            numero={
                                loading
                                    ? "..."
                                    : formatNumber(totalClasses)
                            }
                            texto="Turmas"
                            cor="bg-purple-100"
                        />

                    </div>

                    {/* DOCENTES POR TITULAÇÃO */}

                    <Card className="rounded-2xl border-none shadow-sm">

                        <CardContent className="h-75 p-5">

                            <h2 className="font-bold mb-4">
                                Docentes por titulação
                            </h2>

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>

                                    <Pie
                                        data={teachersByDegree}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {teachersByDegree.map(
                                            (_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        COLORS[
                                                        index % COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                </PieChart>
                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </div>

                {/* GRÁFICOS SUPERIORES */}

                <div className="grid grid-cols-2 gap-4 mb-6">

                    {/* TURMAS POR SEMESTRE */}

                    <Card className="rounded-2xl border-none shadow-sm">

                        <CardContent className="h-75 p-5">

                            <h2 className="font-bold mb-4">
                                Turmas por semestre
                            </h2>

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart data={classesByPeriod}>

                                    <XAxis dataKey="periodo" />

                                    <YAxis allowDecimals={false} />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total"
                                        name="Turmas"
                                        fill="#9CB59E"
                                        radius={[8, 8, 0, 0]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                    {/* SITUAÇÃO DAS TURMAS */}

                    <Card className="rounded-2xl border-none shadow-sm">

                        <CardContent className="p-5">

                            <h2 className="font-bold text-lg mb-4">
                                Situação das turmas
                            </h2>

                            <div className="h-100">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart data={classesByStatus}>

                                        <XAxis dataKey="name" />

                                        <YAxis allowDecimals={false} />

                                        <Tooltip />

                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            name="Turmas"
                                            stroke="#5B8CCB"
                                            fill="#5B8CCB"
                                            fillOpacity={0.2}
                                            strokeWidth={3}
                                        />

                                    </AreaChart>
                                </ResponsiveContainer>

                            </div>

                        </CardContent>

                    </Card>

                </div>

                {/* GRÁFICO PRINCIPAL */}

                <Card className="rounded-2xl border-none shadow-sm">

                    <CardContent className="p-5">

                        <div className="flex justify-between mb-4">

                            <h2 className="font-bold text-lg">
                                Docentes com mais turmas
                            </h2>

                        </div>

                        <div className="h-100">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={classesByTeacher}
                                >

                                    <XAxis
                                        dataKey="name"
                                        interval={0}
                                        angle={-15}
                                        textAnchor="end"
                                        height={80}
                                    />

                                    <YAxis allowDecimals={false} />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total"
                                        name="Turmas"
                                        fill="#5f95c9"
                                        radius={[8, 8, 0, 0]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                    </CardContent>

                </Card>

                {loading && (
                    <p className="text-sm text-gray-500 mt-4">
                        Carregando informações do Dashboard...
                    </p>
                )}

            </main>

        </div>
    );
}

// CARD

function DashboardCard({
    numero,
    texto,
    cor,
}: {
    numero: string;
    texto: string;
    cor: string;
}) {
    return (
        <Card className="rounded-2xl border-none shadow-sm">

            <CardContent className="p-5 flex items-center gap-4">

                <div
                    className={`w-14 h-14 rounded-xl ${cor} flex items-center justify-center`}
                >
                    <Users
                        size={22}
                        className="text-zinc-700"
                    />
                </div>

                <div>

                    <h2 className="text-4xl font-bold">
                        {numero}
                    </h2>

                    <p className="text-gray-500">
                        {texto}
                    </p>

                </div>

            </CardContent>

        </Card>
    );
}
