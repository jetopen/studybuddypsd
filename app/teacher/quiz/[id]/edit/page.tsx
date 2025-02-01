"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getQuestionsForQuiz, createQuizQuestion, type QuizQuestion } from "../../../../../utils/lessonContent"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Pencil, Loader2 } from "lucide-react"

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestionsForQuiz(params.id)
        setQuestions(fetchedQuestions)
      } catch (error) {
        console.error("Error fetching questions:", error)
        toast({
          title: "Error",
          description: "Failed to load quiz questions.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [params.id])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!newQuestion || options.some((option) => !option) || !correctAnswer) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    if (!options.includes(correctAnswer)) {
      toast({
        title: "Validation Error",
        description: "Correct answer must be one of the options.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const newQuestionData = await createQuizQuestion(params.id, newQuestion, options, correctAnswer, questions.length)
      setQuestions([...questions, newQuestionData])
      setNewQuestion("")
      setOptions(["", "", "", ""])
      setCorrectAnswer("")
      toast({
        title: "Success",
        description: "Question added successfully.",
      })
    } catch (error) {
      console.error("Error adding question:", error)
      toast({
        title: "Error",
        description: "Failed to add question.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Quiz
      </Button>

      <div className="grid gap-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Quiz Questions</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>Create a new multiple choice question for this quiz.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter your question here"
                    />
                  </div>
                  {options.map((option, index) => (
                    <div key={index} className="grid gap-2">
                      <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                      <Input
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}`}
                      />
                    </div>
                  ))}
                  <div className="grid gap-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Input
                      id="correct-answer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Enter the correct answer (must match one of the options)"
                    />
                  </div>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Question
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-start">
                    <span>Question {index + 1}</span>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded-md ${
                          option === question.correct_answer
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        {option}
                        {option === question.correct_answer && (
                          <span className="ml-2 text-sm text-green-600 dark:text-green-400">(Correct Answer)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

