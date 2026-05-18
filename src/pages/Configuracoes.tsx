import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Configuracoes() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-800">Configurações</h1>
            <p className="text-zinc-500 mt-2">
              Gerencie preferências, segurança e informações da instituição.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <div className="bg-white rounded-3xl shadow-md p-4 h-fit">
            <nav className="space-y-2">
              <MenuItem label="Perfil" />
              <MenuItem label="Instituição" />
              <MenuItem label="Permissões" />
              <MenuItem label="Segurança" />
              <MenuItem label="Aparência" />
            </nav>
          </div>

          {/* CONTENT */}
          <div className="xl:col-span-3 space-y-6">
            {/* PERFIL */}
            <section className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-800">
                    Perfil do Administrador
                  </h2>

                  <p className="text-zinc-500 text-sm mt-1">
                    Atualize suas informações pessoais.
                  </p>
                </div>

                <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-600">
                  JD
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Nome Completo" placeholder="John Doe" />
                <InputField
                  label="E-mail"
                  placeholder="john@universidade.com"
                />

                <InputField label="Telefone" placeholder="(11) 99999-9999" />

                <InputField label="Cargo" placeholder="Administrador" />
              </div>
            </section>

            {/* INSTITUIÇÃO */}
            <section className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                Informações da Instituição
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Nome da Instituição"
                  placeholder="Universidade Alpha"
                />

                <InputField label="CNPJ" placeholder="00.000.000/0001-00" />

                <InputField
                  label="E-mail Institucional"
                  placeholder="contato@universidade.com"
                />

                <InputField label="Telefone" placeholder="(11) 4002-8922" />
              </div>
            </section>

            {/* SEGURANÇA */}
            <section className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                Segurança
              </h2>

              <div className="space-y-5">
                <ToggleItem
                  title="Autenticação em dois fatores"
                  description="Adiciona uma camada extra de segurança na conta."
                  enabled
                />

                <ToggleItem
                  title="Login com biometria"
                  description="Permite autenticação biométrica nos dispositivos compatíveis."
                />

                <ToggleItem
                  title="Sessão automática"
                  description="Manter usuário conectado após login."
                  enabled
                />
              </div>
            </section>

            {/* TEMA */}
            <section className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                Aparência
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ThemeCard
                  title="Claro"
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                />

                <ThemeCard
                  title="Escuro"
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />

                <ThemeCard
                  title="Sistema"
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </div>
            </section>
            <Button className="bg-blue-900 p-6 text-md">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* MENU ITEM */
function MenuItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full text-left px-4 py-3 rounded-md transition-all duration-300 ${
        active
          ? "bg-blue-900 text-white shadow-md"
          : "hover:bg-zinc-100 text-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}

/* INPUT */
function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="border border-zinc-200 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-black transition-all"
      />
    </div>
  );
}

/* TOGGLE */
function ToggleItem({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border border-zinc-200 rounded-2xl p-4">
      <div>
        <h3 className="font-semibold text-zinc-800">{title}</h3>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>

      <div
        className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${
          enabled ? "bg-green-500 justify-end" : "bg-zinc-300 justify-start"
        }`}
      >
        <div className="w-6 h-6 bg-white rounded-full shadow-md" />
      </div>
    </div>
  );
}

/* TEMA */
/* TEMA */
function ThemeCard({
  title,
  active = false,
  onClick,
}: {
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        active
          ? "border-black bg-zinc-100 shadow-md dark:border-white dark:bg-zinc-800"
          : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
      }`}
    >
      <div className="h-24 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 mb-4" />

      <p className="font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
    </button>
  );
}
