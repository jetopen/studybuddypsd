"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "../../../../components/Layout"
import { FlashcardReview } from "../../../../components/FlashcardReview"
import { getLessonById } from "../../../../utils/lessonContent"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FlashcardPage({ params }: { params: { lessonId: string } }) {
  const [lessonTitle, setLessonTitle] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchLessonInfo = async () => {
      try {
        const lessonInfo = await getLessonById(params.lessonId)
        setLessonTitle(lessonInfo.title)
        setSubjectName(lessonInfo.subject.name)
      } catch (error) {
        console.error("Error fetching lesson info:", error)
      }
    }

    fetchLessonInfo()
  }, [params.lessonId])

  return (
    <Layout title={`Flashcards: ${subjectName} - ${lessonTitle}`}>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <FlashcardReview lessonId={params.lessonId} />
      </div>
    </Layout>
  )
}

