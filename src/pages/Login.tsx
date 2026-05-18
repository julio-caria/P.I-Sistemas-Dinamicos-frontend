import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/LOGO.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      navigate("/home");
    } else {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="flex justify-center">
      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-6xl min-h-150 flex flex-col">
        {/* HEADER */}
        <header>
          <div>
            <div className="w-50 h-10 flex">
              <img
                className="w-45 h-45 absolute top-5 left-15"
                src={Logo}
                alt="LOGO"
              />
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex items-center justify-center px-4">
          <section className="w-full max-w-md text-center m-25">
            {/* Ícone */}
            <div className="mt-20 mb-10 w-40 h-14 mx-auto flex items-center justify-center">
              <img className="h-40 " src={Logo} alt="LOGO" />
            </div>

            {/* Título */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Entrar com sua conta
            </h2>

            {/* Texto */}
            <p className="text-gray-500 text-sm mb-4">
              Faça login para acessar
              <br />
              sua conta
            </p>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-3 text-left "
            >
              {/* EMAIL */}
              <Input
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Input>

              {/* SENHA */}
              <Input
                type="password"
                placeholder="***************"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              ></Input>

              {/* CHECKBOX */}
              <div className="flex text-sm text-gray-500 mt-7 gap-3">
                <Checkbox id="terms-checkbox" name="terms-checkbox" />
                <Label htmlFor="terms-checkbox">Lembrar-me</Label>
              </div>

              {/* BOTÃO */}
              <Button
                type="submit"
                className="cursor-pointer bg-blue-900 text-white hover:brightness-115"
              >
                Entrar
              </Button>

              {/* ERRO */}
              {erro && (
                <p className="text-red-500 text-sm text-center mt-2">{erro}</p>
              )}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
