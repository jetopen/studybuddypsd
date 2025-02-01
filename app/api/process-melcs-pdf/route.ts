import { NextResponse } from "next/server"
import { supabase } from "../../../utils/supabase"
import { extractPDFContent } from "../../../utils/pdfProcessing"
import { generateQuizFromPDF } from "../../../utils/aiContentGeneration"
import { saveAIGeneratedQuiz } from "../../../utils/lessonContent"

export async function POST(req: Request) {
  try {
    const { pdfId, lessonId } = await req.json()

    // Fetch the PDF file information from Supabase
    const { data: pdfData, error: pdfError } = await supabase
      .from("melcs_pdfs")
      .select("file_path, subjects(name, suitable_grades)")
      .eq("id", pdfId)
      .single()

    if (pdfError || !pdfData) {
      return NextResponse.json({ error: "Failed to fetch PDF data" }, { status: 400 })
    }

    // Download the PDF file from Supabase Storage
    const { data: fileData, error: fileError } = await supabase.storage.from("melcs_pdfs").download(pdfData.file_path)

    if (fileError || !fileData) {
      return NextResponse.json({ error: "Failed to download PDF file" }, { status: 400 })
    }

    // Extract content from the PDF
    const pdfContent = await extractPDFContent(await fileData.arrayBuffer())

    // Generate quiz using Gemini
    const quizQuestions = await generateQuizFromPDF(
      pdfContent,
      pdfData.subjects.name,
      pdfData.subjects.suitable_grades[0], // Using the first suitable grade
      10, // Generating 10 questions
    )

    // Save the generated quiz to Supabase
    const savedQuiz = await saveAIGeneratedQuiz(lessonId, quizQuestions)

    return NextResponse.json({ quizId: savedQuiz.id })
  } catch (error) {
    console.error("Error processing MELCs PDF:", error)
    return NextResponse.json({ error: "Failed to process MELCs PDF" }, { status: 500 })
  }
}

