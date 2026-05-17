import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/components/layouts/AppLayout";
import Home from "@/pages/Home";
import Login from "./pages/Login";
import Alunos from "./pages/Alunos";
import Fornecedores from "./pages/Fornecedores";
import Docentes from "./pages/Docentes";
import Cursos from "./pages/Cursos";
import Turmas from "./pages/Turmas";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
 
const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path:"/secretariat/students", element: <Alunos /> },
          { path: "/secretariat/courses", element: <Cursos /> },
          { path: "/secretariat/teachers", element: <Docentes />  },
          { path: "/settings", element: <Configuracoes /> },
          { path: "/secretariat/suppliers", element: <Fornecedores /> },
          { path: "/secretariat/classes", element: <Turmas /> },
          { path: "/admin/users", element: <Usuarios /> },
        ],
      },
      { path: "/", element: <Login /> },
    // Rotas fora do layout (login, 404, etc.)
    // { path: "/login", element: <Login /> },
]);
 
export function Router() {
    return <RouterProvider router={router} />;
}
 
