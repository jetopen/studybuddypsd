import { NextResponse } from "next/server"
import { extractPDFContent } from "../../../utils/pdfProcessing"
import { generateQuizFromPDF } from "../../../utils/aiContentGeneration"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File
    const subject = formData.get("subject") as string
    const gradeLevel = Number.parseInt(formData.get("gradeLevel") as string)
    const questionCount = Number.parseInt(formData.get("questionCount") as string)

    if (!pdfFile || !subject || isNaN(gradeLevel) || isNaN(questionCount)) {
      return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 })
    }

    const buffer = await pdfFile.arrayBuffer()
    const pdfContent = await extractPDFContent(Buffer.from(buffer))

    const quizQuestions = await generateQuizFromPDF(pdfContent, subject, gradeLevel, questionCount)

    return NextResponse.json({ quizQuestions })
  } catch (error) {
    console.error("Error processing PDF and generating quiz:", error)
    return NextResponse.json({ error: "Failed to process PDF and generate quiz" }, { status: 500 })
  }
}

