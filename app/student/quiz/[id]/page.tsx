"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "../../../../utils/supabase"
import { getQuestionsForQuiz, submitQuizAttempt, type QuizQuestion } from "../../../../utils/lessonContent"
import { Layout } from "../../../../components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { QuizComponent } from "../../../../components/QuizComponent"
import "../../../../styles/academic-theme.css"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestionsForQuiz(params.id)
        setQuestions(fetchedQuestions)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching quiz questions:", error)
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchQuizQuestions()
  }, [params.id])

  const handleQuizCompletion = async (score: number) => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("User not found")
      }

      await submitQuizAttempt(params.id, user.id, score)
      setQuizCompleted(true)
      setFinalScore(score)
      toast({
        title: "Quiz Completed",
        description: `Your score: ${score}/${questions.length}`,
      })
    } catch (error) {
      console.error("Error submitting quiz attempt:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz results. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Layout title="Loading Quiz...">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-academic-blue" />
        </div>
      </Layout>
    )
  }

  if (questions.length === 0) {
    return (
      <Layout title="No Questions Available">
        <Card>
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>This quiz doesn't have any questions yet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.back()} className="academic-button">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout title={quizCompleted ? "Quiz Completed" : "Quiz"}>
      {quizCompleted ? (
        <Card className="w-full max-w-2xl mx-auto academic-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              {finalScore === questions.length ? (
                <CheckCircle className="mr-2 text-green-500" />
              ) : (
                <XCircle className="mr-2 text-academic-orange" />
              )}
              Quiz Completed!
            </CardTitle>
            <CardDescription>
              Your score: {finalScore}/{questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">
              Congratulations on completing the quiz! Your results have been recorded.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => router.back()} className="nav-button">
              Return to Lesson
            </Button>
            <Button onClick={() => router.push("/student/home")} className="nav-button">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <QuizComponent questions={questions} onComplete={handleQuizCompletion} />
      )}
    </Layout>
  )
}

