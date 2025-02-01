"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "../../../utils/supabase"
import {
  getSubjectsForTeacher,
  getLessonsForSubject,
  createSubject,
  createLesson,
  getSubjectGradeLevels,
  type Subject,
  type Lesson,
} from "../../../utils/subjectsData"
import { generateFlashcards, generateQuizContent, generateQuizFromMELCs } from "../../../utils/aiContentGeneration"
import { saveAIGeneratedQuiz, saveAIGeneratedFlashcards } from "../../../utils/lessonContent"
import { BookOpen, Plus, Brain, FileText, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { getMELCs, addMELC, type MELC } from "../../../utils/melcsData"
import { supabase } from "../../../utils/supabase"
import { Layout } from "../../../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({})
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectGrades, setNewSubjectGrades] = useState<number[]>([])
  const [newLessonTitle, setNewLessonTitle] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<string>("")
  const [lessonContent, setLessonContent] = useState("")
  const [contentType, setContentType] = useState<"quiz" | "flashcards">("quiz")
  const [contentCount, setContentCount] = useState(5)
  const [questionCount, setQuestionCount] = useState<number>(5)
  const router = useRouter()
  const [melcs, setMelcs] = useState<MELC[]>([])
  const [newMelc, setNewMelc] = useState({ grade_level: 1, subject: "", competency: "" })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)
  const [lessonsBySubject, setLessonsBySubject] = useState<{ [key: string]: any[] }>({})
  const [flashcardCount, setFlashcardCount] = useState(5)
  const [generationContent, setGenerationContent] = useState("")
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(null)

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

        if (currentUser.role === "teacher") {
          const fetchedSubjects = await getSubjectsForTeacher(currentUser.id)
          setSubjects(fetchedSubjects)

          const lessonsPromises = fetchedSubjects.map((subject) =>
            getLessonsForSubject(subject.id).then((subjectLessons) => ({ [subject.id]: subjectLessons })),
          )
          const lessonsResults = await Promise.all(lessonsPromises)
          setLessons(Object.assign({}, ...lessonsResults))
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

  const handleCreateSubject = async () => {
    if (user && newSubjectName && newSubjectGrades.length > 0) {
      try {
        const newSubject = await createSubject(newSubjectName, newSubjectGrades, user.id)
        setSubjects((prev) => [...prev, newSubject])
        setNewSubjectName("")
        setNewSubjectGrades([])
        toast({
          title: "Success",
          description: "New subject created successfully.",
        })
      } catch (error) {
        console.error("Error creating subject:", error)
        toast({
          title: "Error",
          description: "Failed to create new subject. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateLesson = async () => {
    if (user && selectedSubject && newLessonTitle) {
      try {
        const newLesson = await createLesson(newLessonTitle, selectedSubject, user.id)
        setLessons((prev) => ({
          ...prev,
          [selectedSubject]: [...(prev[selectedSubject] || []), newLesson],
        }))
        setNewLessonTitle("")
        setSelectedSubject("")
        toast({
          title: "Success",
          description: "New lesson created successfully.",
        })
      } catch (error) {
        console.error("Error creating lesson:", error)
        toast({
          title: "Error",
          description: "Failed to create new lesson. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleGenerateContent = async () => {
    if (!selectedLesson || !lessonContent) {
      toast({
        title: "Error",
        description: "Please select a lesson and provide lesson content.",
        variant: "destructive",
      })
      return
    }

    try {
      const selectedLessonObj = Object.values(lessons)
        .flat()
        .find((lesson) => lesson.id === selectedLesson)
      if (!selectedLessonObj) {
        throw new Error("Selected lesson not found")
      }

      const selectedSubjectObj = subjects.find((subject) => subject.id === selectedLessonObj.subject_id)
      if (!selectedSubjectObj) {
        throw new Error("Subject for selected lesson not found")
      }

      let generatedContent
      if (contentType === "quiz") {
        generatedContent = await generateQuizContent(selectedSubjectObj.name, newMelc.grade_level, contentCount)
        await saveAIGeneratedQuiz(selectedLesson, generatedContent)
      } else {
        generatedContent = await generateFlashcards(selectedSubjectObj.name, newMelc.grade_level, contentCount)
        await saveAIGeneratedFlashcards(selectedLesson, generatedContent)
      }

      toast({
        title: "Success",
        description: `AI-generated ${contentType} saved successfully.`,
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchMelcs = async (grade: number, subject: string) => {
    try {
      const fetchedMelcs = await getMELCs(grade, subject)
      setMelcs(fetchedMelcs)
    } catch (error) {
      console.error("Error fetching MELCs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch MELCs.",
        variant: "destructive",
      })
    }
  }

  const handleAddMelc = async () => {
    try {
      await addMELC(newMelc)
      setNewMelc({ grade_level: 1, subject: "", competency: "" })
      toast({
        title: "Success",
        description: "MELC added successfully.",
      })
      fetchMelcs(newMelc.grade_level, newMelc.subject)
    } catch (error) {
      console.error("Error adding MELC:", error)
      toast({
        title: "Error",
        description: "Failed to add MELC.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateQuiz = async () => {
    if (!selectedSubject || !selectedLesson || !selectedGradeLevel) {
      toast({
        title: "Error",
        description: "Please select a subject, lesson, and grade level",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const subject = subjects.find((s) => s.id === selectedSubject)
      if (!subject) {
        throw new Error("Invalid subject selected")
      }

      console.log("Generating quiz for:", subject.name, "Grade:", selectedGradeLevel, "Questions:", questionCount)

      const quizQuestions = await generateQuizFromMELCs(
        subject.name,
        selectedGradeLevel,
        questionCount,
        generationContent,
      )

      console.log("Generated quiz questions:", quizQuestions)

      if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        throw new Error("Failed to generate quiz questions")
      }

      // First, insert the quiz into the quizzes table
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          lesson_id: selectedLesson,
          title: `Generated Quiz for ${subject.name}`,
          description: `AI-generated quiz based on MELCs for ${subject.name}`,
          is_ai_generated: true,
        })
        .select()
        .single()

      if (quizError) {
        throw new Error(`Failed to save quiz to database: ${quizError.message}`)
      }

      // Then, insert the questions into the quiz_questions table
      const questionsToInsert = quizQuestions.map((question) => ({
        quiz_id: quizData.id,
        question: question.question,
        options: JSON.stringify(question.options),
        correct_answer: question.options[question.correctAnswer],
        is_ai_generated: true,
      }))

      const { error: questionsError } = await supabase.from("quiz_questions").insert(questionsToInsert)

      if (questionsError) {
        throw new Error(`Failed to save quiz questions to database: ${questionsError.message}`)
      }

      setGeneratedQuiz(quizQuestions)

      toast({
        title: "Success",
        description: "Quiz generated and saved successfully!",
      })
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!selectedSubject || !selectedLesson || !selectedGradeLevel) {
      toast({
        title: "Error",
        description: "Please select a subject, lesson, and grade level",
        variant: "destructive",
      })
      return
    }

    try {
      const subject = subjects.find((s) => s.id === selectedSubject)
      if (!subject) {
        throw new Error("Invalid subject selected")
      }

      const flashcards = await generateFlashcards(subject.name, selectedGradeLevel, flashcardCount, generationContent)
      await saveAIGeneratedFlashcards(selectedLesson, flashcards)

      toast({
        title: "Success",
        description: "Flashcards generated and saved successfully!",
      })
    } catch (error) {
      console.error("Error generating flashcards:", error)
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setSelectedGradeLevel(null)
  }, [selectedSubject])

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find((s) => s.id === selectedSubject)
      if (subject) {
        const gradeLevels = getSubjectGradeLevels(subject)
        setSelectedGradeLevel(null) // Reset selected grade level
      }
    }
  }, [selectedSubject, subjects])

  useEffect(() => {
    if (selectedSubject) {
      const fetchLessonsForSubject = async () => {
        const { data, error } = await supabase.from("lessons").select("*").eq("subject_id", selectedSubject)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch lessons",
            variant: "destructive",
          })
        } else {
          setLessonsBySubject((prev) => ({
            ...prev,
            [selectedSubject]: data || [],
          }))
        }
      }

      fetchLessonsForSubject()
    }
  }, [selectedSubject])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>No user found. Please sign in.</div>
  }

  return (
    <Layout title="Teacher Dashboard">
      <div className="space-y-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Video className="mr-2 text-orange-500" />
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 text-orange-500" />
              My Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {subjects.map((subject) => (
                <AccordionItem value={subject.id} key={subject.id}>
                  <AccordionTrigger>{subject.name}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {lessons[subject.id]?.map((lesson) => (
                        <li key={lesson.id}>
                          <Button
                            variant="link"
                            className="p-0 h-auto font-normal"
                            onClick={() => router.push(`/teacher/lesson/${lesson.id}`)}
                          >
                            {lesson.title}
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSelectedSubject(subject.id)
                        // Open add lesson dialog
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Lesson
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button
              className="w-full mt-4"
              onClick={() => {
                /* Open add subject dialog */
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 text-orange-500" />
              Generate Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-select">Select Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lesson-select">Select Lesson</Label>
                <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                  <SelectTrigger id="lesson-select">
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonsBySubject[selectedSubject]?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade-level-select">Select Grade Level</Label>
                <Select
                  value={selectedGradeLevel?.toString()}
                  onValueChange={(value) => setSelectedGradeLevel(Number(value))}
                >
                  <SelectTrigger id="grade-level-select">
                    <SelectValue placeholder="Choose a grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubject &&
                      subjects
                        .find((s) => s.id === selectedSubject)
                        ?.suitable_grades.map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question-count">Number of Questions: {questionCount}</Label>
                <Slider
                  id="question-count"
                  min={1}
                  max={20}
                  step={1}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="quiz-content">Quiz Content</Label>
                <Input
                  id="quiz-content"
                  placeholder="Enter additional content or context for the quiz"
                  value={generationContent}
                  onChange={(e) => setGenerationContent(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button className="w-full" onClick={handleGenerateQuiz} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 text-orange-500" />
              Generate Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="flashcard-subject-select">Select Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="flashcard-subject-select">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flashcard-lesson-select">Select Lesson</Label>
                <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                  <SelectTrigger id="flashcard-lesson-select">
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonsBySubject[selectedSubject]?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade-level-select">Select Grade Level</Label>
                <Select
                  value={selectedGradeLevel?.toString()}
                  onValueChange={(value) => setSelectedGradeLevel(Number(value))}
                >
                  <SelectTrigger id="grade-level-select">
                    <SelectValue placeholder="Choose a grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubject &&
                      subjects
                        .find((s) => s.id === selectedSubject)
                        ?.suitable_grades.map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flashcard-count">Number of Flashcards: {flashcardCount}</Label>
                <Slider
                  id="flashcard-count"
                  min={1}
                  max={20}
                  step={1}
                  value={[flashcardCount]}
                  onValueChange={(value) => setFlashcardCount(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="flashcard-content">Flashcard Content</Label>
                <Input
                  id="flashcard-content"
                  placeholder="Enter additional content or context for the flashcards"
                  value={generationContent}
                  onChange={(e) => setGenerationContent(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button className="w-full" onClick={handleGenerateFlashcards} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Flashcards"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

