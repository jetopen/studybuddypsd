import { supabase } from "./supabase"

export interface MELC {
  id: string
  grade_level: number
  subject: string
  competency: string
}

export async function getMELCs(grade_level: number, subject: string): Promise<MELC[]> {
  const { data, error } = await supabase.from("melcs").select("*").eq("grade_level", grade_level).eq("subject", subject)

  if (error) {
    console.error("Error fetching MELCs:", error)
    throw error
  }

  return data || []
}

export async function addMELC(melc: Omit<MELC, "id">): Promise<MELC> {
  const { data, error } = await supabase.from("melcs").insert(melc).select().single()

  if (error) {
    console.error("Error adding MELC:", error)
    throw error
  }

  return data
}

