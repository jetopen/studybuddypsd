import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Home, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export function Layout({ children, title }: LayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <GraduationCap className="mr-2 h-8 w-8" />
            {title}
          </h1>
          <nav>
            <Button variant="ghost" asChild className="text-white hover:text-orange-200 mr-2">
              <Link href="/student/home">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-orange-200 mr-2">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="text-white hover:text-orange-200" onClick={() => router.push("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2023 Virtual Learning Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

