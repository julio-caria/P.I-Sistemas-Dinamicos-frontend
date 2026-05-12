import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/LOGO.png"

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const MASTER = {
    email: "admin@admin.com",
    senha: "123456",
  };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (email === MASTER.email && senha === MASTER.senha) {
      navigate("/usuarios");
    } else {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="flex justify-center">
      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-6xl min-h-[600px] flex flex-col">

        {/* HEADER */}
        <header>
          <div>
            <div className="w-50 h-10 flex">
                <img className="w-45 h-45 absolute top-5 left-15" src={Logo} alt="LOGO"/>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex items-center justify-center px-4">
          <section className="w-full max-w-md text-center m-25">

            {/* Ícone */}
            <div className="mt-20 mb-10 w-40 h-14 mx-auto flex items-center justify-center">
              <img className="h-40 " src={Logo} alt="LOGO"/>
            </div>

            {/* Título */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Entrar com sua conta
            </h2>

            {/* Texto */}
            <p className="text-gray-500 text-sm mb-4">
              Faça login para acessar 
              <br/>sua conta
            </p>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-3 text-left "
            >
              {/* EMAIL */}
              <input
                type="email"
                placeholder="johndoe@hotmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="m-4 border-0 border-b-2 border-gray-500 py-2 max-w-80 self-center"
                required
              />

              {/* SENHA */}
              <input
                type="password"
                placeholder="***************"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className=" border-0 border-b-2 border-gray-500 py-2 max-w-80 self-center"
                required
              />

              {/* CHECKBOX */}
              <div className="flex justify-center text-sm text-gray-500 mt-7 gap-3">
                <input className="w-4" type="checkbox" id="lembrar" />
                <label className="text-base font-semibold text-gray-600" htmlFor="lembrar">Lembrar-me</label>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                className="mt-4 w-50 bg-neutral-800 text-white py-2 self-center hover:bg-neutral-700 transition"
              >
                Entrar
              </button>

              {/* ERRO */}
              {erro && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {erro}
                </p>
              )}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}