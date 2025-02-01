-- Add is_ai_generated column to quizzes table
ALTER TABLE quizzes ADD COLUMN is_ai_generated BOOLEAN DEFAULT FALSE;

-- Add is_ai_generated column to quiz_questions table
ALTER TABLE quiz_questions ADD COLUMN is_ai_generated BOOLEAN DEFAULT FALSE;

-- Create flashcards table
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for flashcards
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Teachers can manage flashcards
CREATE POLICY "Teachers can manage flashcards" ON flashcards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE lessons.id = flashcards.lesson_id
      AND lessons.teacher_id = auth.uid()
    )
  );

-- Students can read flashcards
CREATE POLICY "Students can read flashcards" ON flashcards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'student'
    )
  );

