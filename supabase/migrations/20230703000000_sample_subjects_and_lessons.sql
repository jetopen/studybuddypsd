-- Sample Subjects and Lessons for all grade levels
-- Teacher ID: 1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d

-- Insert sample subjects
INSERT INTO public.subjects (id, name, teacher_id, suitable_grades) VALUES
('2a1f3d4e-5b6c-7d8e-9f0a-1b2c3d4e5f6a', 'Elementary Mathematics', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[1,2,3,4,5]),
('3b2e4f5d-6c7g-8h9i-0j1k-2l3m4n5o6p7', 'Middle School Mathematics', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[6,7,8]),
('4c3f5g6e-7h8i-9j0k-1l2m-3n4o5p6q7r', 'High School Mathematics', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[9,10,11,12]),
('5d4g6h7f-8i9j-0k1l-2m3n-4o5p6q7r8s', 'Elementary Science', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[1,2,3,4,5]),
('6e5h7i8g-9j0k-1l2m-3n4o-5p6q7r8s9t', 'Middle School Science', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[6,7,8]),
('7f6i8j9h-0k1l-2m3n-4o5p-6q7r8s9t0u', 'High School Science', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[9,10,11,12]),
('8g7j9k0i-1l2m-3n4o-5p6q-7r8s9t0u1v', 'Elementary English', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[1,2,3,4,5]),
('9h8k0l1j-2m3n-4o5p-6q7r-8s9t0u1v2w', 'Middle School English', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[6,7,8]),
('0i9l1m2k-3n4o-5p6q-7r8s-9t0u1v2w3x', 'High School English', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[9,10,11,12]),
('1j0m2n3l-4o5p-6q7r-8s9t-0u1v2w3x4y', 'Elementary History', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[1,2,3,4,5]),
('2k1n3o4m-5p6q-7r8s-9t0u-1v2w3x4y5z', 'Middle School History', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[6,7,8]),
('3l2o4p5n-6q7r-8s9t-0u1v-2w3x4y5z6a', 'High School History', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', ARRAY[9,10,11,12]);

-- Insert sample lessons for Elementary Mathematics
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Addition and Subtraction', '2a1f3d4e-5b6c-7d8e-9f0a-1b2c3d4e5f6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic addition and subtraction operations.'),
('Multiplication Tables', '2a1f3d4e-5b6c-7d8e-9f0a-1b2c3d4e5f6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Learning and practicing multiplication tables.'),
('Introduction to Fractions', '2a1f3d4e-5b6c-7d8e-9f0a-1b2c3d4e5f6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Understanding and working with simple fractions.');

-- Insert sample lessons for Middle School Mathematics
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Algebra Basics', '3b2e4f5d-6c7g-8h9i-0j1k-2l3m4n5o6p7', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Introduction to algebraic concepts and equations.'),
('Geometry Fundamentals', '3b2e4f5d-6c7g-8h9i-0j1k-2l3m4n5o6p7', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic geometric shapes and their properties.'),
('Ratios and Proportions', '3b2e4f5d-6c7g-8h9i-0j1k-2l3m4n5o6p7', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Understanding and applying ratios and proportions.');

-- Insert sample lessons for High School Mathematics
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Advanced Algebra', '4c3f5g6e-7h8i-9j0k-1l2m-3n4o5p6q7r', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Complex algebraic equations and functions.'),
('Trigonometry', '4c3f5g6e-7h8i-9j0k-1l2m-3n4o5p6q7r', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Trigonometric functions and their applications.'),
('Calculus Introduction', '4c3f5g6e-7h8i-9j0k-1l2m-3n4o5p6q7r', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic concepts of differential and integral calculus.');

-- Insert sample lessons for Elementary Science
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Plants and Animals', '5d4g6h7f-8i9j-0k1l-2m3n-4o5p6q7r8s', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic characteristics of plants and animals.'),
('The Water Cycle', '5d4g6h7f-8i9j-0k1l-2m3n-4o5p6q7r8s', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Understanding the water cycle and its importance.'),
('Simple Machines', '5d4g6h7f-8i9j-0k1l-2m3n-4o5p6q7r8s', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Introduction to simple machines and their uses.');

-- Insert sample lessons for Middle School Science
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Cells and Organisms', '6e5h7i8g-9j0k-1l2m-3n4o-5p6q7r8s9t', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Structure and function of cells in living organisms.'),
('Introduction to Chemistry', '6e5h7i8g-9j0k-1l2m-3n4o-5p6q7r8s9t', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic chemical concepts and reactions.'),
('Earth and Space', '6e5h7i8g-9j0k-1l2m-3n4o-5p6q7r8s9t', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Exploring the Earth''s structure and the solar system.');

-- Insert sample lessons for High School Science
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Advanced Biology', '7f6i8j9h-0k1l-2m3n-4o5p-6q7r8s9t0u', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Complex biological systems and processes.'),
('Physics Principles', '7f6i8j9h-0k1l-2m3n-4o5p-6q7r8s9t0u', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Fundamental laws and principles of physics.'),
('Environmental Science', '7f6i8j9h-0k1l-2m3n-4o5p-6q7r8s9t0u', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Human impact on the environment and sustainability.');

-- Insert sample lessons for Elementary English
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Phonics and Reading', '8g7j9k0i-1l2m-3n4o-5p6q-7r8s9t0u1v', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Basic phonics rules and reading practice.'),
('Grammar Basics', '8g7j9k0i-1l2m-3n4o-5p6q-7r8s9t0u1v', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Introduction to parts of speech and sentence structure.'),
('Creative Writing', '8g7j9k0i-1l2m-3n4o-5p6q-7r8s9t0u1v', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Encouraging creativity through story writing.');

-- Insert sample lessons for Middle School English
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Literature Analysis', '9h8k0l1j-2m3n-4o5p-6q7r-8s9t0u1v2w', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Analyzing themes and characters in literature.'),
('Essay Writing', '9h8k0l1j-2m3n-4o5p-6q7r-8s9t0u1v2w', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Structure and techniques for effective essay writing.'),
('Public Speaking', '9h8k0l1j-2m3n-4o5p-6q7r-8s9t0u1v2w', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Developing public speaking skills and confidence.');

-- Insert sample lessons for High School English
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Advanced Literature', '0i9l1m2k-3n4o-5p6q-7r8s-9t0u1v2w3x', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'In-depth analysis of classic and contemporary literature.'),
('Argumentative Writing', '0i9l1m2k-3n4o-5p6q-7r8s-9t0u1v2w3x', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Crafting persuasive arguments in writing.'),
('Media Literacy', '0i9l1m2k-3n4o-5p6q-7r8s-9t0u1v2w3x', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Critical analysis of various media forms.');

-- Insert sample lessons for Elementary History
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Community Helpers', '1j0m2n3l-4o5p-6q7r-8s9t-0u1v2w3x4y', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Learning about different roles in the community.'),
('Native American Cultures', '1j0m2n3l-4o5p-6q7r-8s9t-0u1v2w3x4y', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Introduction to various Native American cultures.'),
('Early Explorers', '1j0m2n3l-4o5p-6q7r-8s9t-0u1v2w3x4y', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Stories of early explorers and their discoveries.');

-- Insert sample lessons for Middle School History
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('Ancient Civilizations', '2k1n3o4m-5p6q-7r8s-9t0u-1v2w3x4y5z', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Study of major ancient civilizations and their contributions.'),
('American Revolution', '2k1n3o4m-5p6q-7r8s-9t0u-1v2w3x4y5z', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Causes and effects of the American Revolution.'),
('World Geography', '2k1n3o4m-5p6q-7r8s-9t0u-1v2w3x4y5z', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Understanding world geography and cultures.');

-- Insert sample lessons for High School History
INSERT INTO public.lessons (title, subject_id, teacher_id, content) VALUES
('World War II', '3l2o4p5n-6q7r-8s9t-0u1v-2w3x4y5z6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Comprehensive study of World War II and its global impact.'),
('Civil Rights Movement', '3l2o4p5n-6q7r-8s9t-0u1v-2w3x4y5z6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Examination of the Civil Rights Movement in the United States.'),
('Modern Global Issues', '3l2o4p5n-6q7r-8s9t-0u1v-2w3x4y5z6a', '1a7bdb5c-7cf4-48b2-88e9-1bff538eb27d', 'Analysis of contemporary global challenges and events.');

