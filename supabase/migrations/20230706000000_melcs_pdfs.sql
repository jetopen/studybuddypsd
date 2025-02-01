-- Create MELCs PDFs table
CREATE TABLE public.melcs_pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.melcs_pdfs ENABLE ROW LEVEL SECURITY;

-- Allow teachers to manage MELCs PDFs
CREATE POLICY "Teachers can manage MELCs PDFs" ON public.melcs_pdfs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.subjects
    WHERE subjects.id = melcs_pdfs.subject_id
    AND subjects.teacher_id = auth.uid()
  )
);

-- Allow students to read MELCs PDFs
CREATE POLICY "Students can read MELCs PDFs" ON public.melcs_pdfs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'student'
  )
);

