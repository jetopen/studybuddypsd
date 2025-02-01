-- Create MELCs table
CREATE TABLE public.melcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_level INTEGER NOT NULL,
  subject TEXT NOT NULL,
  competency TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.melcs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to MELCs" ON public.melcs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert and update access to teachers only
CREATE POLICY "Allow teachers to manage MELCs" ON public.melcs
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'teacher'
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
CREATE TRIGGER update_melcs_modtime
BEFORE UPDATE ON public.melcs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

