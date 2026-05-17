import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "./avatar"
import {   
  Home,
  BookOpen,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronDown,
 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
 
type NavItem = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  url?: string
  items?: { title: string; url: string }[]
}
 
const navItems: NavItem[] = [
  {
    title: "Home",
    icon: Home,
    url: "/home",
  },
  {
    title: "Secretaria",
    icon: BookOpen,
    items: [
      { title: "Alunos", url: "/secretariat/students" },
      { title: "Cursos", url: "/secretariat/courses" },
      { title: "Turmas", url: "/secretariat/classes" },
      { title: "Docentes", url: "/secretariat/teachers" },
      { title: "Fornecedores", url: "/secretariat/suppliers" },
    ],
  },
  {
    title: "Administração",
    icon: ShieldCheck,
    items: [
      { title: "Usuários", url: "/admin/users" },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/settings",
  },
]


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-900 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            U
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            UniGest
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2.5 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={item.title === "Secretaria"}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="
                            w-full flex items-center gap-2.5
                            rounded-md text-zinc-600
                            hover:bg-blue-900 hover:text-white
                            data-[state=open]:text-zinc-600
                            bg-zinc-50
                            font-bold p-4
                            transition-colors
                          "
                        >
                          <item.icon className="size-4.25 shrink-0 opacity-85" />
                          <span className="flex-1 text-left">{item.title}</span>
                          <ChevronDown
                            className="
                              size-3.25 opacity-50 shrink-0
                              transition-transform duration-200
                              group-data-[state=open]/collapsible:rotate-180
                            "
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
 
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-2.5 pl-2.5 border-l-0 gap-0.5">
                          {item.items.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className="
                                  flex items-center gap-2.5 p-4
                                  rounded-md text-zinc-600
                                  hover:bg-blue-900 hover:text-white
                                  data-[active=true]:bg-blue-900
                                  data-[active=true]:text-white
                                  transition-colors font-medium
                                "
                              >
                                <a href={sub.url}>
                                  <span
                                    className="
                                      w-1.5 h-1.5 rounded-full bg-white/45 shrink-0
                                      in-data-[active=true]:bg-blue-900
                                    "
                                  />
                                  {sub.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (

                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="
                        flex items-center gap-2.5 p-4
                        rounded-md text-zinc-600
                        font-medium
                        hover:bg-blue-900 hover:text-white
                        data-[active=true]:bg-blue-900
                        data-[active=true]:text-white
                        transition-colors
                      "
                    >
                      <a href={item.url}>
                        <item.icon className="size-4.25 shrink-0 opacity-85" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.07] cursor-pointer transition-colors">
          <Avatar className="w-8.5 h-8.5 rounded-lg shrink-0">
            <AvatarFallback className="rounded-lg bg-blue-900 text-white text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-zinc-800 leading-tight">
              John Doe
            </p>
            <p className="text-[11.5px] text-zinc-400 truncate leading-tight">
              johndoe@instituicao.com.br
            </p>
          </div>
          <LogOut className="size-4.25 text-red-400 hover:brightness-75 shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}