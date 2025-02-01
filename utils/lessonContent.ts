import { supabase } from "./supabase"

export interface Material {
  id: string
  lesson_id: string
  title: string
  content: string
  type: "text" | "video" | "document"
  order_index: number
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  description: string | null
  is_ai_generated: boolean
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  options: string[]
  correct_answer: string
  is_ai_generated: boolean
}

export interface Flashcard {
  id: string
  lesson_id: string
  question: string
  answer: string
  is_ai_generated: boolean
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  score: number
  completed_at: string
}

export async function getMaterialsForLesson(lessonId: string): Promise<Material[]> {
  const { data, error } = await supabase.from("materials").select("*").eq("lesson_id", lessonId).order("order_index")

  if (error) {
    console.error("Error fetching materials:", error)
    throw error
  }

  return data || []
}

export async function getQuizzesForLesson(lessonId: string): Promise<Quiz[]> {
  const { data, error } = await supabase.from("quizzes").select("*").eq("lesson_id", lessonId)

  if (error) {
    console.error("Error fetching quizzes:", error)
    throw error
  }

  return data || []
}

export async function getQuestionsForQuiz(quizId: string): Promise<QuizQuestion[]> {
  const { data, error } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId)

  if (error) {
    console.error("Error fetching quiz questions:", error)
    throw error
  }

  return data.map((question) => ({
    ...question,
    options: JSON.parse(question.options),
  }))
}

export async function submitQuizAttempt(quizId: string, userId: string, score: number): Promise<QuizAttempt> {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ quiz_id: quizId, user_id: userId, score })
    .select()
    .single()

  if (error) {
    console.error("Error submitting quiz attempt:", error)
    throw error
  }

  return data
}

export async function createMaterial(
  lessonId: string,
  title: string,
  content: string,
  type: "text" | "video" | "document",
  orderIndex: number,
): Promise<Material> {
  const { data, error } = await supabase
    .from("materials")
    .insert({ lesson_id: lessonId, title, content, type, order_index: orderIndex })
    .select()
    .single()

  if (error) {
    console.error("Error creating material:", error)
    throw error
  }

  return data
}

export async function createQuiz(lessonId: string, title: string, description?: string): Promise<Quiz> {
  const { data, error } = await supabase
    .from("quizzes")
    .insert({ lesson_id: lessonId, title, description })
    .select()
    .single()

  if (error) {
    console.error("Error creating quiz:", error)
    throw error
  }

  return data
}

export async function createQuizQuestion(
  quizId: string,
  question: string,
  options: string[],
  correctAnswer: string,
  orderIndex: number,
): Promise<QuizQuestion> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: quizId,
      question,
      options,
      correct_answer: correctAnswer,
      order_index: orderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating quiz question:", error)
    throw error
  }

  return data
}

export interface AIGeneratedContent {
  id: string
  subject_id: string
  lesson_id: string
  type: "quiz" | "flashcards"
  content: string
  created_at: string
}

export async function saveAIGeneratedContent(
  subjectId: string,
  lessonId: string,
  type: "quiz" | "flashcards",
  content: string,
): Promise<AIGeneratedContent> {
  const { data, error } = await supabase
    .from("ai_generated_content")
    .insert({ subject_id: subjectId, lesson_id: lessonId, type, content })
    .select()
    .single()

  if (error) {
    console.error("Error saving AI generated content:", error)
    throw error
  }

  return data
}

export async function getAIGeneratedContentForLesson(lessonId: string): Promise<AIGeneratedContent[]> {
  const { data, error } = await supabase
    .from("ai_generated_content")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching AI generated content:", error)
    throw error
  }

  return data || []
}

export async function getAIGeneratedContentForSubject(subjectId: string): Promise<AIGeneratedContent[]> {
  const { data, error } = await supabase
    .from("ai_generated_content")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching AI generated content for subject:", error)
    throw error
  }

  return data || []
}

export async function saveAIGeneratedQuiz(lessonId: string, quizQuestions: QuizQuestion[]): Promise<Quiz> {
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({ lesson_id: lessonId, title: "AI Generated Quiz", is_ai_generated: true })
    .select()
    .single()

  if (quizError) {
    console.error("Error creating AI-generated quiz:", quizError)
    throw quizError
  }

  const questionsToInsert = quizQuestions.map((question) => ({
    quiz_id: quiz.id,
    question: question.question,
    options: question.options,
    correct_answer: question.options[question.correctAnswer],
    is_ai_generated: true,
  }))

  const { error: questionsError } = await supabase.from("quiz_questions").insert(questionsToInsert)

  if (questionsError) {
    console.error("Error inserting AI-generated quiz questions:", questionsError)
    throw questionsError
  }

  return quiz
}

export async function saveAIGeneratedFlashcards(lessonId: string, flashcards: Flashcard[]): Promise<Flashcard[]> {
  const flashcardsToInsert = flashcards.map((flashcard) => ({
    lesson_id: lessonId,
    question: flashcard.question,
    answer: flashcard.answer,
    is_ai_generated: true,
  }))

  const { data, error } = await supabase.from("flashcards").insert(flashcardsToInsert).select()

  if (error) {
    console.error("Error inserting AI-generated flashcards:", error)
    throw error
  }

  return data
}

export async function getAIGeneratedQuizzesForLesson(lessonId: string): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_ai_generated", true)

  if (error) {
    console.error("Error fetching AI-generated quizzes:", error)
    throw error
  }

  return data
}

export async function getAIGeneratedFlashcardsForLesson(lessonId: string): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_ai_generated", true)

  if (error) {
    console.error("Error fetching AI-generated flashcards:", error)
    throw error
  }

  return data
}

export async function getLessonById(lessonId: string): Promise<{ title: string; subject: { name: string } }> {
  const { data, error } = await supabase.from("lessons").select("title, subjects(name)").eq("id", lessonId).single()

  if (error) {
    console.error("Error fetching lesson:", error)
    throw error
  }

  return {
    title: data.title,
    subject: {
      name: data.subjects.name,
    },
  }
}

export {
  getMaterialsForLesson,
  getQuizzesForLesson,
  getQuestionsForQuiz,
  submitQuizAttempt,
  createMaterial,
  createQuiz,
  createQuizQuestion,
  saveAIGeneratedContent,
  getAIGeneratedContentForLesson,
  getAIGeneratedContentForSubject,
  saveAIGeneratedQuiz,
  saveAIGeneratedFlashcards,
  getAIGeneratedQuizzesForLesson,
  getAIGeneratedFlashcardsForLesson,
  getLessonById,
}

