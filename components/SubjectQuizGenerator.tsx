"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { FileText, Loader2 } from "lucide-react"
import { GeneratedContent } from "./GeneratedContent"
import { supabase } from "../utils/supabase"

interface Subject {
  id: string
  name: string
  suitable_grades: number[]
}

interface Lesson {
  id: string
  name: string
  subject_id: string
}

const SUBJECT_TO_MELC_MAP: { [key: string]: string } = {
  English: "English-CG.pdf",
  Filipino: "Filipino-CG.pdf",
  Mathematics: "Math-CG.pdf",
  Science: "Science-CG.pdf",
  "Araling Panlipunan": "AP-CG.pdf",
  Music: "Music-CG.pdf",
  Arts: "Arts-CG.pdf",
  "Physical Education": "PE-CG.pdf",
  Health: "Health-CG.pdf",
  EPP: "EPP-CG.pdf",
  ESP: "ESP-CG.pdf",
  "Mother Tongue": "Mother-Tongue-CG.pdf",
}

const SUPABASE_STORAGE_URL = "https://nzejtrbtmiixbqpplojh.supabase.co/storage/v1/object/public/melcs"

export function SubjectQuizGenerator() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedLesson, setSelectedLesson] = useState<string>("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubject) {
      fetchLessons(selectedSubject)
    }
  }, [selectedSubject])

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select("*")

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive",
      })
    } else {
      setSubjects(data || [])
    }
  }

  async function fetchLessons(subjectId: string) {
    const { data, error } = await supabase.from("lessons").select("*").eq("subject_id", subjectId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive",
      })
    } else {
      setLessons(data || [])
    }
  }

  const handleGenerateQuiz = async () => {
    if (!selectedSubject || !selectedLesson) {
      toast({
        title: "Error",
        description: "Please select both a subject and a lesson",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const subject = subjects.find((s) => s.id === selectedSubject)
      if (!subject || !SUBJECT_TO_MELC_MAP[subject.name]) {
        throw new Error("Invalid subject selected")
      }

      // Fetch the MELCs PDF content
      const melcFileName = SUBJECT_TO_MELC_MAP[subject.name]
      const response = await fetch(`${SUPABASE_STORAGE_URL}/${melcFileName}`)
      const pdfBlob = await response.blob()

      // Create form data with the PDF and other parameters
      const formData = new FormData()
      formData.append("pdf", pdfBlob, melcFileName)
      formData.append("subject", subject.name)
      formData.append("questionCount", questionCount.toString())
      formData.append("gradeLevel", subject.suitable_grades[0].toString())

      // Send to our API endpoint
      const result = await fetch("/api/process-pdf-and-generate-quiz", {
        method: "POST",
        body: formData,
      })

      if (!result.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await result.json()

      // Save the generated quiz to Supabase
      const { error: saveError } = await supabase.from("quizzes").insert({
        lesson_id: selectedLesson,
        title: `Generated Quiz for ${subject.name}`,
        description: `AI-generated quiz based on MELCs for ${subject.name}`,
        is_ai_generated: true,
      })

      if (saveError) {
        throw new Error("Failed to save quiz to database")
      }

      setGeneratedQuiz(data.quizQuestions)

      toast({
        title: "Success",
        description: "Quiz generated and saved successfully!",
      })
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Quiz from MELCs</CardTitle>
        <CardDescription>Select a subject and lesson to generate quiz questions using AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {subject.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Lesson</Label>
          <Select value={selectedLesson} onValueChange={setSelectedLesson}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {lesson.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Number of Questions ({questionCount})</Label>
          <Slider
            value={[questionCount]}
            onValueChange={(value) => setQuestionCount(value[0])}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <Button
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !selectedSubject || !selectedLesson}
          className="w-full"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
        </Button>

        {generatedQuiz && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Generated Quiz</h3>
            <GeneratedContent content={JSON.stringify(generatedQuiz)} type="quiz" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

