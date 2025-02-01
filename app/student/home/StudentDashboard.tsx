"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "../../../utils/supabase"
import {
  getSubjectsForGrade,
  getLessonsForSubject,
  getProgressForUser,
  type Subject,
  type Lesson,
  type Progress,
} from "../../../utils/subjectsData"
import { Layout } from "../../../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { BookOpen, Play, Brain, Video } from "lucide-react"
import "../../../styles/academic-theme.css"
import { supabase } from "../../../utils/supabase"
import { CheckCircle } from "lucide-react"

interface LessonWithFlashcards extends Lesson {
  hasFlashcards: boolean
}

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<{ [key: string]: LessonWithFlashcards[] }>({})
  const [progress, setProgress] = useState<{ [key: string]: Progress }>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          toast({
            title: "Error",
            description: "No user found. Please sign in.",
            variant: "destructive",
          })
          router.push("/signin")
          return
        }

        setUser(currentUser)

        if (currentUser.role === "student") {
          const fetchedSubjects = await getSubjectsForGrade(currentUser.grade_level)
          setSubjects(fetchedSubjects)

          // Fetch lessons and check for flashcards
          const lessonsPromises = fetchedSubjects.map(async (subject) => {
            const subjectLessons = await getLessonsForSubject(subject.id)
            const lessonsWithFlashcards = await Promise.all(
              subjectLessons.map(async (lesson) => {
                const { count } = await supabase
                  .from("flashcards")
                  .select("*", { count: "exact", head: true })
                  .eq("lesson_id", lesson.id)
                return {
                  ...lesson,
                  hasFlashcards: count > 0,
                }
              }),
            )
            return { [subject.id]: lessonsWithFlashcards }
          })

          const lessonsResults = await Promise.all(lessonsPromises)
          setLessons(Object.assign({}, ...lessonsResults))

          const userProgress = await getProgressForUser(currentUser.id)
          const progressMap = userProgress.reduce(
            (acc, curr) => {
              acc[curr.lesson_id] = curr
              return acc
            },
            {} as { [key: string]: Progress },
          )
          setProgress(progressMap)
        } else {
          toast({
            title: "Error",
            description: "Invalid user role for this dashboard.",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "An error occurred while loading the dashboard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-academic-blue"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout title="Error">
        <div>No user found. Please sign in.</div>
      </Layout>
    )
  }

  return (
    <Layout title={`Student Dashboard - Grade ${user.grade_level}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Video Section */}
        <Card className="academic-card col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Video className="mr-2 academic-icon" />
              Video Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://drive.google.com/file/d/1CFOXlFLbb5i39yNTSu2K_87eyg9PkrXC/preview"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        {/* Flashcards Section */}
        <Card className="academic-card col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Brain className="mr-2 academic-icon" />
              Flashcard Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {subjects.map((subject) => {
                const subjectLessons = lessons[subject.id]?.filter((lesson) => lesson.hasFlashcards) || []
                if (subjectLessons.length === 0) return null

                return (
                  <AccordionItem value={subject.id} key={subject.id}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-academic-blue">
                      {subject.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {subjectLessons.map((lesson) => (
                          <Button
                            key={lesson.id}
                            variant="ghost"
                            className="w-full justify-start text-left font-normal hover:text-academic-orange"
                            onClick={() => router.push(`/student/flashcards/${lesson.id}`)}
                          >
                            <Brain className="mr-2 h-4 w-4" />
                            {lesson.title}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* My Subjects and Lessons Section */}
        <Card className="academic-card col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 academic-icon" />
              My Subjects and Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {subjects.map((subject) => (
                <AccordionItem value={subject.id} key={subject.id}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-academic-blue">
                    {subject.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-4">
                      {lessons[subject.id]?.map((lesson) => (
                        <li key={lesson.id} className="flex items-center justify-between">
                          <Button
                            variant="link"
                            className="p-0 h-auto font-normal text-academic-blue hover:text-academic-orange"
                            onClick={() => router.push(`/student/lesson/${lesson.id}`)}
                          >
                            {lesson.title}
                          </Button>
                          <div className="flex items-center gap-2">
                            {lesson.hasFlashcards && <Brain className="h-4 w-4 text-academic-orange" />}
                            {progress[lesson.id] && (
                              <span className="text-sm">
                                {progress[lesson.id].status === "completed" ? (
                                  <CheckCircle className="text-green-500" />
                                ) : progress[lesson.id].status === "in_progress" ? (
                                  <Play className="text-academic-orange" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                )}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

