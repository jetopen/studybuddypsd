import { NextResponse } from "next/server"
import { processMELCsPDF } from "../../../utils/pdfProcessing"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File
    const subject = formData.get("subject") as string

    if (!pdfFile || !subject) {
      return NextResponse.json({ error: "Missing PDF file or subject" }, { status: 400 })
    }

    const buffer = await pdfFile.arrayBuffer()
    await processMELCsPDF(Buffer.from(buffer), subject)

    return NextResponse.json({ message: "MELCs processed successfully" })
  } catch (error) {
    console.error("Error processing MELCs:", error)
    return NextResponse.json({ error: "Failed to process MELCs" }, { status: 500 })
  }
}

