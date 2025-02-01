"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "../../utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { LandingLayout } from "@/components/LandingLayout"
import Link from "next/link"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log("Attempting to sign in with username:", username)
      const user = await signIn(username, password)
      console.log("Sign in successful, user data:", user)
      localStorage.setItem("user", JSON.stringify(user))
      toast({
        title: "Signed in",
        description: "You've successfully signed in!",
      })
      console.log("Redirecting to:", user.role === "student" ? "/student/home" : "/teacher/home")
      router.push(user.role === "student" ? "/student/home" : "/teacher/home")
    } catch (error) {
      console.error("Error during sign in:", error)
      let errorMessage = "There was a problem signing in. Please check your credentials and try again."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String(error.message)
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LandingLayout
      title="Welcome Back!"
      description="Sign in to access your personalized learning experience. Track your progress, join live sessions, and engage with your peers and teachers."
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zib8dvnVY4uW6r5PovHtznOm6FxyEn.png"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSignIn} className="space-y-4">
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
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/signup" className="text-orange-600 hover:underline">
          Don't have an account? Sign up
        </Link>
      </div>
    </LandingLayout>
  )
}

