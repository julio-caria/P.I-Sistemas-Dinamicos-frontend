# UniGest

Sistema web de gestão acadêmica desenvolvido como projeto integrador. O frontend permite administrar usuários e dados da secretaria, além de apresentar indicadores em um painel inicial.

## Integrantes 

| Nome                        | Responsabilidade                                |
|------                       |------------------                               |
| Fabio Yoshihara             | Responsável pela Bateria de Testes              |
| João Gabriel                | Integração e Desenvolvimento Front-end          |
| Júlio César Vilela Caria    | Desenvolvimento Back-End e Documentação da API  |
| Marcos Nazario              | Documentação                                    |
| Matheus Ferrari             | Documentação                                    |

## Sobre o projeto

O UniGest centraliza operações administrativas de uma instituição de ensino por meio de uma interface moderna e responsiva.

Principais funcionalidades:

- Painel com indicadores e gráficos sobre alunos, docentes e turmas
- Gestão de alunos
- Gestão de cursos
- Gestão de turmas
- Gestão de docentes
- Gestão de fornecedores
- Gestão de usuários
- Tela de configurações
- Autenticação por e-mail e senha
- Armazenamento seguro do token de acesso no navegador

## Stack utilizada

### Frontend

- React 19
- TypeScript 6
- Vite 8
- React Router DOM 7
- Tailwind CSS 4
- Radix UI e componentes inspirados no shadcn/ui
- Recharts
- Lucide React
- Sonner
- ESLint

### Integração

- API REST
- Variável de ambiente `VITE_API_URL`
- Autenticação via token Bearer

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Uma API compatível disponível e em execução

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/julio-caria/P.I-Sistemas-Dinamicos-frontend.git
cd P.I-Sistemas-Dinamicos-frontend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```bash
cp .env.example .env
```

No Windows PowerShell, caso o comando acima não esteja disponível:

```powershell
Copy-Item .env.example .env
```

Configure a URL da API:

```env
VITE_API_URL=http://localhost:3333
```

### 4. Iniciar a aplicação

```bash
npm run dev
```

A aplicação será disponibilizada pelo Vite. Normalmente o endereço exibido no terminal é `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Executa a verificação de tipos e gera o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Visualiza localmente o build de produção |

## Estrutura do projeto

```text
src/
├── assets/          # Imagens e recursos visuais
├── components/
│   ├── layouts/     # Estrutura principal das páginas
│   ├── themes/      # Configuração de tema
│   └── ui/          # Componentes de interface
├── pages/           # Páginas da aplicação
├── services/        # Comunicação com a API
├── App.tsx          # Componente raiz
├── main.tsx         # Inicialização da aplicação
└── router.tsx       # Configuração das rotas
```

## Rotas da aplicação

| Rota | Página |
| --- | --- |
| `/` | Login |
| `/home` | Painel principal |
| `/secretariat/students` | Alunos |
| `/secretariat/courses` | Cursos |
| `/secretariat/classes` | Turmas |
| `/secretariat/teachers` | Docentes |
| `/secretariat/suppliers` | Fornecedores |
| `/admin/users` | Usuários |
| `/settings` | Configurações |

## Autenticação e API

O login envia as credenciais para o endpoint:

```text
POST /api/v1/login
```

Após o login, o token recebido é salvo no `localStorage` ou `sessionStorage`, conforme a opção **Lembrar-me**. O token é enviado nas requisições protegidas pelo cabeçalho:

```text
Authorization: Bearer <token>
```

Os principais recursos consumidos pela aplicação estão agrupados em `/api/v1`, incluindo alunos, docentes, turmas, cursos, fornecedores e usuários.

## Build para produção

```bash
npm run build
npm run preview
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## Repositório

- [Frontend no GitHub](https://github.com/julio-caria/P.I-Sistemas-Dinamicos-frontend)
- [Backend no GitHub](https://github.com/julio-caria/P.I-Sistemas-Dinamicos-server)

---

<div align="center">

**Unigest API**  
Sistema de Gestão de Universidade

Projeto Integrador - SENAC - Tecnologia em Sistemas para a Internet - 4º Semestre - Grupo 01.

Desenvolvido por [João Gabriel](https://github.com/JoaoGabrielO)
</div>

----
