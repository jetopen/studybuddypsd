import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText, Trash2 } from "lucide-react"

interface Subject {
  id: string
  name: string
}

interface MELCPDF {
  id: string
  subject_id: string
  file_name: string
  file_path: string
  uploaded_at: string
}

export function MELCsPDFManager() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [melcsPDFs, setMelcsPDFs] = useState<MELCPDF[]>([])

  useEffect(() => {
    fetchSubjects()
    fetchMELCsPDFs()
  }, [])

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select("id, name")
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive",
      })
    } else {
      setSubjects(data || [])
    }
  }

  async function fetchMELCsPDFs() {
    const { data, error } = await supabase.from("melcs_pdfs").select("*")
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch MELCs PDFs",
        variant: "destructive",
      })
    } else {
      setMelcsPDFs(data || [])
    }
  }

  async function handleFileUpload() {
    if (!file || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject and a file",
        variant: "destructive",
      })
      return
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `melcs_pdfs/${fileName}`

    const { error: uploadError } = await supabase.storage.from("melcs_pdfs").upload(filePath, file)

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
      return
    }

    const { error: insertError } = await supabase.from("melcs_pdfs").insert({
      subject_id: selectedSubject,
      file_name: file.name,
      file_path: filePath,
    })

    if (insertError) {
      toast({
        title: "Error",
        description: "Failed to save file information",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "MELCs PDF uploaded successfully",
      })
      fetchMELCsPDFs()
    }
  }

  async function handleDeletePDF(id: string, filePath: string) {
    const { error: deleteStorageError } = await supabase.storage.from("melcs_pdfs").remove([filePath])

    if (deleteStorageError) {
      toast({
        title: "Error",
        description: "Failed to delete file from storage",
        variant: "destructive",
      })
      return
    }

    const { error: deleteDbError } = await supabase.from("melcs_pdfs").delete().eq("id", id)

    if (deleteDbError) {
      toast({
        title: "Error",
        description: "Failed to delete file information from database",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "MELCs PDF deleted successfully",
      })
      fetchMELCsPDFs()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
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
      <div className="space-y-2">
        <Label htmlFor="file">MELCs PDF</Label>
        <Input id="file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={handleFileUpload}>
        <Upload className="mr-2 h-4 w-4" /> Upload MELCs PDF
      </Button>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Uploaded MELCs PDFs</h3>
        {melcsPDFs.map((pdf) => (
          <div key={pdf.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>{pdf.file_name}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDeletePDF(pdf.id, pdf.file_path)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

