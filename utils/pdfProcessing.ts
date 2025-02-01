import pdf from "pdf-parse"

export async function extractPDFContent(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    const data = await pdf(Buffer.from(pdfBuffer))
    return data.text
  } catch (error) {
    console.error("Error extracting PDF content:", error)
    throw error
  }
}

