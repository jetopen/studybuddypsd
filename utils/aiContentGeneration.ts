import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export async function generateQuizFromPDF(
  pdfContent: string,
  subjectName: string,
  gradeLevel: number,
  count: number,
): Promise<QuizQuestion[]> {
  const prompt = getPromptForQuizFromPDF(pdfContent, subjectName, gradeLevel, count)

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response")
    }

    const parsedContent = JSON.parse(jsonMatch[0])
    validateQuizContent(parsedContent)

    return parsedContent
  } catch (error) {
    console.error("Error generating quiz content:", error)
    throw new Error(`Failed to generate quiz content: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function generateQuizContent(
  subjectName: string,
  gradeLevel: number,
  count: number,
): Promise<QuizQuestion[]> {
  const prompt = `Generate a quiz for ${subjectName} at grade level ${gradeLevel} with ${count} questions.`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response")
    }

    const parsedContent = JSON.parse(jsonMatch[0])
    validateQuizContent(parsedContent)

    return parsedContent
  } catch (error) {
    console.error("Error generating quiz content:", error)
    throw new Error(`Failed to generate quiz content: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function getPromptForQuizFromPDF(pdfContent: string, subjectName: string, gradeLevel: number, count: number): string {
  return `You are an expert teacher in ${subjectName}. I'm providing you with the full content of a curriculum PDF. Your tasks are:

1. Analyze the PDF content and extract the relevant information for Grade ${gradeLevel} in ${subjectName}.
2. Based on the extracted information, generate ${count} multiple-choice questions.

Here's the PDF content:

${pdfContent}

IMPORTANT: You must respond with ONLY a valid JSON array of quiz questions. Do not include any additional text, explanations, or formatting.
The response should be parseable by JSON.parse() directly.

Generate multiple-choice questions in this exact JSON format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "correctAnswer": 0
  }
]

Requirements:
- Generate exactly ${count} questions
- Each question must have exactly 4 options
- correctAnswer must be a valid index (0-3) pointing to the correct option
- Make questions clear and unambiguous
- Include one definitively correct answer
- Make incorrect options plausible but clearly wrong
- Vary the difficulty level
- Focus on key concepts from the Grade ${gradeLevel} ${subjectName} curriculum in the PDF`
}

function validateQuizContent(content: any[]): asserts content is QuizQuestion[] {
  if (!Array.isArray(content)) {
    throw new Error("Quiz content must be an array")
  }
  for (const item of content) {
    if (!item.question || typeof item.question !== "string") {
      throw new Error("Invalid quiz question format: missing or invalid question")
    }
    if (!Array.isArray(item.options) || item.options.length !== 4) {
      throw new Error("Invalid quiz options format: must be an array with exactly 4 options")
    }
    if (typeof item.correctAnswer !== "number" || item.correctAnswer < 0 || item.correctAnswer > 3) {
      throw new Error("Invalid correct answer: must be a valid index (0-3)")
    }
  }
}

export async function generateFlashcards(
  subjectName: string,
  gradeLevel: number,
  count: number,
  additionalContent: string,
): Promise<{ question: string; answer: string }[]> {
  const prompt = getPromptForFlashcards(subjectName, gradeLevel, count, additionalContent)

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response")
    }

    const parsedContent = JSON.parse(jsonMatch[0])
    validateFlashcards(parsedContent)

    return parsedContent
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error(`Failed to generate flashcards: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function getPromptForFlashcards(
  subjectName: string,
  gradeLevel: number,
  count: number,
  additionalContent: string,
): string {
  return `You are an expert teacher in ${subjectName} for Grade ${gradeLevel}, familiar with the DepEd Most Essential Learning Competencies (MELCs). Your task is to generate ${count} flashcards based on the MELCs for this subject and grade level.

  Ensure that the content is appropriate and challenging for Grade ${gradeLevel} students, adhering strictly to the DepEd MELCs standards for this grade level and subject.

  Additional content to consider:
  ${additionalContent}

  IMPORTANT: Respond with ONLY a valid JSON array. Do not include any additional text, explanations, or formatting.
  The response should be parseable by JSON.parse() directly.

  Generate flashcards in this exact JSON format:
  [
    {
      "question": "What is the capital of the Philippines?",
      "answer": "Manila"
    }
  ]

  Requirements:
  - Generate exactly ${count} flashcards
  - Each flashcard must have a question and an answer
  - Make questions clear and concise
  - Answers should be brief but informative
  - Ensure the difficulty level is appropriate for Grade ${gradeLevel}
  - Focus on key concepts covered in ${subjectName} for Grade ${gradeLevel} based on DepEd MELCs
  - Incorporate the provided additional content into the flashcards where relevant`
}

function validateFlashcards(content: any[]): asserts content is { question: string; answer: string }[] {
  for (const item of content) {
    if (!item.question || typeof item.question !== "string") {
      throw new Error("Invalid flashcard format: missing or invalid question")
    }
    if (!item.answer || typeof item.answer !== "string") {
      throw new Error("Invalid flashcard format: missing or invalid answer")
    }
  }
}

export async function generateQuizFromMELCs(
  subjectName: string,
  gradeLevel: number,
  count: number,
  additionalContent: string,
): Promise<QuizQuestion[]> {
  const prompt = `You are an expert in the Philippine K-12 curriculum, specifically familiar with the DepEd Most Essential Learning Competencies (MELCs) for Grade ${gradeLevel} ${subjectName}. Generate a quiz with ${count} questions based on the MELCs for this subject and grade level.

  Ensure that the content is appropriate and challenging for Grade ${gradeLevel} students, adhering strictly to the DepEd MELCs standards for this grade level and subject.

  Additional content to consider:
  ${additionalContent}

  IMPORTANT: Respond with ONLY a valid JSON array of quiz questions. Do not include any additional text, explanations, or formatting.
  The response should be parseable by JSON.parse() directly.

  Generate multiple-choice questions in this exact JSON format:
  [
    {
      "question": "What is the capital of the Philippines?",
      "options": ["Manila", "Cebu", "Davao", "Quezon City"],
      "correctAnswer": 0
    }
  ]

  Requirements:
  - Generate exactly ${count} questions
  - Each question must have exactly 4 options
  - correctAnswer must be a valid index (0-3) pointing to the correct option
  - Make questions clear and unambiguous
  - Include one definitively correct answer
  - Make incorrect options plausible but clearly wrong
  - Ensure the difficulty level is appropriate for Grade ${gradeLevel}
  - Focus on key concepts from the Grade ${gradeLevel} ${subjectName} curriculum based on DepEd MELCs
  - Incorporate the provided additional content into the questions where relevant`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("Raw AI response:", text)

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response")
    }

    const parsedContent = JSON.parse(jsonMatch[0])
    validateQuizContent(parsedContent)

    return parsedContent
  } catch (error) {
    console.error("Error generating quiz content:", error)
    throw new Error(`Failed to generate quiz content: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export { generateQuizFromPDF, generateFlashcards, generateQuizContent, generateQuizFromMELCs }

