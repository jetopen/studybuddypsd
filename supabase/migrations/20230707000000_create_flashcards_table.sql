-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Teachers can manage flashcards
CREATE POLICY "Teachers can manage flashcards" ON public.flashcards
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.lessons
    WHERE lessons.id = flashcards.lesson_id
    AND lessons.teacher_id = auth.uid()
  )
);

-- Students can read flashcards
CREATE POLICY "Students can read flashcards" ON public.flashcards
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'student'
  )
);

-- Create flashcard_progress table for spaced repetition
CREATE TABLE public.flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  flashcard_id UUID REFERENCES public.flashcards(id),
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for flashcard_progress
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Users can manage their own flashcard progress
CREATE POLICY "Users can manage their own flashcard progress" ON public.flashcard_progress
FOR ALL USING (auth.uid() = user_id);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column for flashcards
CREATE TRIGGER update_flashcards_modtime
BEFORE UPDATE ON public.flashcards
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create trigger to automatically update the updated_at column for flashcard_progress
CREATE TRIGGER update_flashcard_progress_modtime
BEFORE UPDATE ON public.flashcard_progress
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

