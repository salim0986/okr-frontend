"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { LayoutDashboard, Target, Users, TrendingUp, Settings, Zap, Building2, Briefcase } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
  },
  {
    name: "Objectives",
    href: "/dashboard/objectives",
    icon: Target,
    roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
  },
  {
    name: "Key Results",
    href: "/dashboard/key-results",
    icon: Zap,
    roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
  },
  {
    name: "Progress",
    href: "/dashboard/progress",
    icon: TrendingUp,
    roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
  },
  {
    name: "Teams",
    href: "/dashboard/teams",
    icon: Users,
    roles: ["admin", "org_admin", "dept_manager", "team_lead"],
  },
  {
    name: "Departments",
    href: "/dashboard/departments",
    icon: Briefcase,
    roles: ["admin", "org_admin"],
  },
  {
    name: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
    roles: ["admin"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin", "org_admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || "employee"))

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
