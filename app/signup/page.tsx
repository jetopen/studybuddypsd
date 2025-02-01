"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "../../utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { LandingLayout } from "@/components/LandingLayout"
import Link from "next/link"

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [gradeLevel, setGradeLevel] = useState<number | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = await signUp(username, password, fullName, role, gradeLevel)
      localStorage.setItem("user", JSON.stringify(user))
      toast({
        title: "Account created",
        description: "You've successfully signed up!",
      })
      router.push(role === "student" ? "/student/home" : "/teacher/home")
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem creating your account.",
        variant: "destructive",
      })
    }
  }

  return (
    <LandingLayout
      title="Join Our Learning Community"
      description="Create your account to embark on a journey of knowledge and growth. Access a wide range of courses, interact with expert teachers, and learn at your own pace."
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zib8dvnVY4uW6r5PovHtznOm6FxyEn.png"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <Label>Role</Label>
          <RadioGroup defaultValue="student" onValueChange={(value) => setRole(value as "student" | "teacher")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teacher" id="teacher" />
              <Label htmlFor="teacher">Teacher</Label>
            </div>
          </RadioGroup>
        </div>
        {role === "student" && (
          <div>
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select onValueChange={(value) => setGradeLevel(Number(value))}>
              <SelectTrigger>
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
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/signin" className="text-orange-600 hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </LandingLayout>
  )
}

