import type React from "react"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
