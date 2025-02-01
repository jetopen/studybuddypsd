"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, CheckCircle, HelpCircle } from "lucide-react"
import type { QuizQuestion } from "@/utils/lessonContent"

interface QuizComponentProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        description: "You must choose an answer before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      onComplete(score + (selectedAnswer === currentQuestion.correct_answer ? 1 : 0))
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto academic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-2 text-academic-orange" />
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardTitle>
        <CardDescription>Select the best answer for each question.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || undefined}>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="nav-button">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNextQuestion} className="academic-button">
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Finish Quiz
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

