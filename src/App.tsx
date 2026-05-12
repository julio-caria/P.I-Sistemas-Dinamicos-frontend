import { BrowserRouter, Routes, Route } from "react-router-dom";
import Alunos from "./pages/Alunos"
import Cursos from "./pages/Cursos";
import Docentes from "./pages/Docentes";
import Configuracoes from "./pages/Configuracoes";
import Fornecedores from "./pages/Fornecedores";
import Home from "./pages/Home";
import Turmas from "./pages/Turmas";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="alunos" element={<Alunos />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/configs" element={<Configuracoes />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/home" element={<Home />} />
          <Route path="/turmas" element={<Turmas />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
