-- Add interval options to flashcard_progress
ALTER TABLE public.flashcard_progress
ADD COLUMN review_count INTEGER DEFAULT 0,
ADD COLUMN last_interval VARCHAR(10) DEFAULT '1m';

-- Add view for subjects with flashcards
CREATE VIEW subjects_with_flashcards AS
SELECT DISTINCT s.*
FROM subjects s
JOIN lessons l ON l.subject_id = s.id
JOIN flashcards f ON f.lesson_id = l.id;

-- Add view for lessons with flashcards
CREATE VIEW lessons_with_flashcards AS
SELECT DISTINCT l.*
FROM lessons l
JOIN flashcards f ON f.lesson_id = l.id;

-- Update flashcard_progress trigger
CREATE OR REPLACE FUNCTION update_flashcard_progress()
RETURNS TRIGGER AS $$
BEGIN
    NEW.review_count := COALESCE(OLD.review_count, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_review_count
    BEFORE UPDATE ON flashcard_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_flashcard_progress();

