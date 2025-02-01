-- Create materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'video', 'document')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own materials
CREATE POLICY "Teachers can manage their materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = materials.lesson_id
      AND l.teacher_id = auth.uid()
    )
  );

-- Students can read materials
CREATE POLICY "Students can read materials" ON public.materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'student'
    )
  );

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_materials_modtime
  BEFORE UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

