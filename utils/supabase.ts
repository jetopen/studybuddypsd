import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signUp(
  username: string,
  password: string,
  fullName: string,
  role: "student" | "teacher",
  gradeLevel: number | null,
) {
  const { data, error } = await supabase
    .from("users")
    .insert({ username, password, full_name: fullName, role, grade_level: gradeLevel })
    .select()
    .single()

  if (error) {
    console.error("Error during sign up:", error)
    throw error
  }

  return data
}

export async function signIn(username: string, password: string) {
  console.log("Attempting to sign in with Supabase")
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .eq("password", password)
    .single()

  if (error) {
    console.error("Error during sign in:", error)
    throw error
  }

  console.log("Sign in successful, user data:", data)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error)
    throw error
  }
  localStorage.removeItem("user")
}

export async function getCurrentUser() {
  const userString = localStorage.getItem("user")
  if (!userString) {
    return null
  }
  return JSON.parse(userString)
}

export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string
    grade_level?: number | null
    password?: string
  },
) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  // Update the user data in local storage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const updatedUser = { ...currentUser, ...data }
  localStorage.setItem("user", JSON.stringify(updatedUser))

  return data
}

