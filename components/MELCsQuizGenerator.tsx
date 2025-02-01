"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { FileText, Loader2 } from "lucide-react"
import { GeneratedContent } from "./GeneratedContent"

const MELCS_FILES = [
  "AP-CG.pdf",
  "Arts-CG.pdf",
  "English-CG.pdf",
  "EPP-CG.pdf",
  "ESP-CG.pdf",
  "Filipino-CG.pdf",
  "Health-CG.pdf",
  "Math-CG.pdf",
  "Mother-Tongue-CG.pdf",
  "Music-CG.pdf",
  "PE-CG.pdf",
  "Science-CG.pdf",
]

const SUPABASE_STORAGE_URL = "https://nzejtrbtmiixbqpplojh.supabase.co/storage/v1/object/public/melcs"

interface MELCsQuizGeneratorProps {
  subjectId: string
  lessonId: string
}

export function MELCsQuizGenerator({ subjectId, lessonId }: MELCsQuizGeneratorProps) {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a MELCs file",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Fetch the PDF content from Supabase storage
      const response = await fetch(`${SUPABASE_STORAGE_URL}/${selectedFile}`)
      const pdfBlob = await response.blob()

      // Create form data with the PDF and other parameters
      const formData = new FormData()
      formData.append("pdf", pdfBlob, selectedFile)
      formData.append("subject", selectedFile.split("-")[0]) // Extract subject from filename
      formData.append("questionCount", questionCount.toString())

      // Send to our API endpoint
      const result = await fetch("/api/process-pdf-and-generate-quiz", {
        method: "POST",
        body: formData,
      })

      if (!result.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await result.json()
      setGeneratedQuiz(data.quizQuestions)

      toast({
        title: "Success",
        description: "Quiz generated successfully!",
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
        <CardDescription>Select a MELCs file and generate quiz questions using AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select MELCs File</Label>
          <Select value={selectedFile} onValueChange={setSelectedFile}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a MELCs file" />
            </SelectTrigger>
            <SelectContent>
              {MELCS_FILES.map((file) => (
                <SelectItem key={file} value={file}>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {file}
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

        <Button onClick={handleGenerateQuiz} disabled={isGenerating || !selectedFile} className="w-full">
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

