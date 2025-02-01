"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, updateUserProfile } from "../../utils/supabase"
import { Layout } from "../../components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { User, GraduationCap, Lock } from "lucide-react"
import "../../styles/academic-theme.css"

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [gradeLevel, setGradeLevel] = useState<number | null>(null)
  const [password, setPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/signin")
        return
      }
      setUser(currentUser)
      setFullName(currentUser.full_name || "")
      setGradeLevel(currentUser.grade_level || null)
    }
    fetchUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const updates: {
        full_name?: string
        grade_level?: number | null
        password?: string
      } = {}

      if (fullName !== user.full_name) updates.full_name = fullName
      if (gradeLevel !== user.grade_level) updates.grade_level = gradeLevel
      if (password) updates.password = password

      const updatedUser = await updateUserProfile(user.id, updates)
      setUser(updatedUser)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem updating your profile.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-academic-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Settings">
      <Card className="w-full max-w-md mx-auto academic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-academic-blue">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center">
                <User className="mr-2 text-academic-orange" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-academic-blue focus:ring-academic-orange"
              />
            </div>
            {user.role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="gradeLevel" className="flex items-center">
                  <GraduationCap className="mr-2 text-academic-orange" />
                  Grade Level
                </Label>
                <Select value={gradeLevel?.toString()} onValueChange={(value) => setGradeLevel(Number(value))}>
                  <SelectTrigger className="border-academic-blue focus:ring-academic-orange">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 text-academic-orange" />
                New Password (leave blank to keep current)
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-academic-blue focus:ring-academic-orange"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full academic-button" onClick={handleSubmit}>
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </Layout>
  )
}

