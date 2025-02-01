"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "../../../../utils/supabase"
import { updateProgress } from "../../../../utils/subjectsData"
import {
  getMaterialsForLesson,
  getQuizzesForLesson,
  getLessonById,
  type Material,
  type Quiz,
} from "../../../../utils/lessonContent"
import { Layout } from "../../../../components/Layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { BookOpen, CheckCircle, Play, FileText } from "lucide-react"
import "../../../../styles/academic-theme.css"

export default function LessonPage({ params }: { params: { id: string } }) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [lessonTitle, setLessonTitle] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (!currentUser) {
          toast({
            title: "Error",
            description: "No user found. Please sign in.",
            variant: "destructive",
          })
          router.push("/signin")
          return
        }

        const [fetchedMaterials, fetchedQuizzes, lessonData] = await Promise.all([
          getMaterialsForLesson(params.id),
          getQuizzesForLesson(params.id),
          getLessonById(params.id),
        ])

        setMaterials(fetchedMaterials)
        setQuizzes(fetchedQuizzes)
        setLessonTitle(lessonData.title)
        setSubjectName(lessonData.subject.name)

        // Update progress when the lesson is viewed
        await updateLessonProgress(currentUser.id, params.id)
      } catch (error) {
        console.error("Error fetching lesson content:", error)
        toast({
          title: "Error",
          description: "Failed to load lesson content.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const updateLessonProgress = async (userId: string, lessonId: string) => {
    try {
      await updateProgress(userId, lessonId, "in_progress")
      setProgress(50) // Set to 50% when in progress
      toast({
        title: "Progress Updated",
        description: "Your progress has been updated.",
      })
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  if (isLoading) {
    return (
      <Layout title="Loading Lesson...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-academic-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${subjectName}: ${lessonTitle}`}>
      <Card className="mb-8 academic-card">
        <CardHeader>
          <CardTitle>Lesson Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="progress-bar h-3">
            <div className="progress-bar-fill h-3" style={{ width: `${progress}%` }}></div>
          </Progress>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-academic-blue">
            <BookOpen className="mr-2 academic-icon" /> Learning Materials
          </h2>
          <div className="space-y-4">
            {materials.map((material) => (
              <Card key={material.id} className="academic-card">
                <CardHeader>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription>
                    {material.type === "video" && <Play className="inline mr-2 academic-icon" />}
                    {material.type === "document" && <FileText className="inline mr-2 academic-icon" />}
                    {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {material.type === "text" && <div className="prose">{material.content}</div>}
                  {material.type === "video" && (
                    <div className="aspect-video">
                      <iframe
                        src={material.content}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {material.type === "document" && (
                    <Button onClick={() => window.open(material.content, "_blank")} className="academic-button">
                      View Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-academic-blue">
            <CheckCircle className="mr-2 academic-icon" /> Quizzes
          </h2>
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="academic-card">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <Button onClick={() => router.push(`/student/quiz/${quiz.id}`)} className="academic-button">
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={() => router.push("/student/home")} className="nav-button">
          Back to Dashboard
        </Button>
        <Button onClick={() => router.push("/student/quiz/1")} className="nav-button">
          Next Lesson
        </Button>
      </div>
    </Layout>
  )
}

