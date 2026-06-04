import {
  CheckSquare,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  Target,
  UserCog,
  UserPlus,
  Users,
  Building,
} from "lucide-react";


export const navigation = [
  {
    title: "Genel",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        label: "Müşteriler",
        href: "/customers",
        icon: Users,
      },
      {
        label: "Potansiyel Müşteriler",
        href: "/leads",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Satış",
    items: [
      {
        label: "Satış Fırsatları",
        href: "/deals",
        icon: Target,
      },
      {
        label: "Teklifler",
        href: "/quotes",
        icon: FileText,
      },
      {
        label: "Görevler",
        href: "/assign-task",
        icon: CheckSquare,
      },
    ],
  },
  {
    title: "Yönetim",
    items: [
      {
        label: "Kullanıcılar",
        href: "/users",
        icon: UserCog,
      },
      {
        label: "Roller",
        href: "/roles",
        icon: ShieldCheck,
      },
      {
        label: "Departmanlar",
        href: "/departments",
        icon: Building,
      }
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        label: "Mesajlar",
        href: "/chat",
        icon: MessageSquare,
      },
      {
        label: "Ayarlar",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];