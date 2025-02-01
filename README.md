# Study Buddy by Study Buddies

## Description

The Study Buddy is an innovative online education system designed to provide a comprehensive and interactive learning experience for students and teachers. This platform offers a range of features including personalized dashboards, subject-specific lessons, quizzes, flashcards, and AI-generated content to enhance the learning process.

Key features include:
- Separate interfaces for students and teachers
- Subject and grade-level specific content
- Interactive quizzes and flashcards
- AI-powered content generation for quizzes and study materials
- Progress tracking and spaced repetition learning

## Installation

To set up the project, follow these steps:

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/mobile-virtual-learning-platform.git
   cd mobile-virtual-learning-platform
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up environment variables:
   Create a \`.env.local\` file in the root directory and add the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NANOGPT_API_KEY=your_nanogpt_api_key
   GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

4. Set up the database:
   - Create a Supabase project and run the migration scripts found in the \`supabase/migrations\` directory.
   - Ensure your Supabase project has the necessary tables and policies set up as defined in the migration files.

## Running the Project

To run the project locally:

1. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

2. Open your browser and navigate to \`http://localhost:3000\`

## Credits

This project uses the following open-source libraries and services:

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Supabase
- Google Generative AI (Gemini)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2023 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

