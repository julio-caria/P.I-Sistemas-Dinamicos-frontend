import {
    Home as HomeIcon,
    GraduationCap,
    FileText,
    BookOpen,
    Users,
    Truck,
    User,
    ChevronLeft,
    ChevronRight,
    CogIcon,
} from "lucide-react";

import React, { type JSX } from "react";

import Logo from "/src/assets/LOGO.svg";

import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
} from "recharts";

type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

const cursosMatriculas = [
    { name: "ADS", value: 120 },
    { name: "Enfermagem", value: 90 },
    { name: "Direito", value: 70 },
    { name: "Administração", value: 50 },
];

const matriculasPeriodo = [
    { periodo: "2024.1", matriculas: 180 },
    { periodo: "2024.2", matriculas: 240 },
    { periodo: "2025.1", matriculas: 320 },
    { periodo: "2025.2", matriculas: 280 },
];

const aprovacoesPeriodo = [
    { periodo: "2024.1", aprovados: 72 },
    { periodo: "2024.2", aprovados: 81 },
    { periodo: "2025.1", aprovados: 88 },
    { periodo: "2025.2", aprovados: 91 },
];

const COLORS = [
    "#7FB3D5",
    "#82E0AA",
    "#F8C471",
    "#F1948A",
];

const areaData = [
    { name: "Jan", value: 100 },
    { name: "Fev", value: 220 },
    { name: "Mar", value: 310 },
    { name: "Abr", value: 280 },
    { name: "Mai", value: 420 },
    { name: "Jun", value: 500 },
    { name: "Jul", value: 350 },
    { name: "Ago", value: 180 },
];

export default function Home(): JSX.Element {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-zinc-100">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r flex flex-col justify-between">
                <div>
                    {/* LOGO */}
                    <div className="p-6 flex items-center justify-center">
                        <img
                            src={Logo}
                            alt="LOGO"
                            className="w-35"
                        />
                    </div>

                    {/* MENU */}
                    <nav className="p-4 space-y-2">
                        <MenuItem
                            icon={<CogIcon size={18} />}
                            label="Configuracoes"
                            onClick={() => navigate("/configs")}
                        />
                        <MenuItem
                            icon={<HomeIcon size={18} />}
                            label="Home"
                            active
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
            <main className="flex-1 p-10 overflow-auto">
                {/* TÍTULO */}
                <h1 className="text-3xl font-bold mb-6">
                    Dashboard
                </h1>

                {/* TOP */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* CARDS */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <DashboardCard
                            numero="4.376"
                            texto="Alunos"
                            cor="bg-blue-100"
                        />

                        <DashboardCard
                            numero="132"
                            texto="Docentes"
                            cor="bg-green-100"
                        />

                        <DashboardCard
                            numero="27"
                            texto="Cursos"
                            cor="bg-purple-100"
                        />
                    </div>

                    {/* CALENDÁRIO */}
                    <Card className="rounded-2xl border-none shadow-sm">
                        <CardContent className="h-[300px] p-5">
                            <h2 className="font-bold mb-4">
                                Cursos com mais matrículas
                            </h2>

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={cursosMatriculas}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {cursosMatriculas.map(
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
                    {/* PIE */}
                    <Card className="rounded-2xl border-none shadow-sm">
                        <CardContent className="h-[300px] p-5">
                            <h2 className="font-bold mb-4">
                                Matrículas por período
                            </h2>

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart data={matriculasPeriodo}>
                                    <XAxis dataKey="periodo" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="matriculas"
                                        fill="#9CB59E"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* BAR */}
                    <Card className="rounded-2xl border-none shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex justify-between mb-4">
                                <h2 className="font-bold text-lg">
                                    Aprovações por período
                                </h2>

                                <Button variant="outline">
                                    Últimos períodos
                                </Button>
                            </div>

                            <div className="h-[400px]">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart
                                        data={aprovacoesPeriodo}
                                    >
                                        <XAxis dataKey="periodo" />

                                        <YAxis />

                                        <Tooltip />

                                        <Area
                                            type="monotone"
                                            dataKey="aprovados"
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
                                Analise
                            </h2>

                            <Button variant="outline">
                                Este mês
                            </Button>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart data={areaData}>
                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#5f95c9"
                                        fill="#5f95c9"
                                        strokeWidth={3}
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

/* CARD */
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

/* MENU */
function MenuItem({
    icon,
    label,
    active = false,
    onClick,
}: MenuItemProps): JSX.Element {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition
      ${active
                    ? "bg-zinc-200 font-semibold"
                    : "hover:bg-zinc-100"
                }`}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}