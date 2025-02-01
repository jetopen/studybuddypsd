"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Volume2,
  Link2,
  Pencil,
  Trash2,
  Brain,
  Image,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Keyboard,
} from "lucide-react"
import { supabase } from "../utils/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Flashcard {
  id: string
  question: string
  answer: string
}

interface FlashcardReviewProps {
  lessonId: string
}

const INTERVALS = {
  AGAIN: { label: "Again", value: "1m", className: "bg-red-50 hover:bg-red-100 text-red-700", key: "1" },
  HARD: { label: "Hard", value: "12h", className: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700", key: "2" },
  GOOD: { label: "Good", value: "1d", className: "bg-green-50 hover:bg-green-100 text-green-700", key: "3" },
  EASY: { label: "Easy", value: "4d", className: "bg-blue-50 hover:bg-blue-100 text-blue-700", key: "4" },
}

const KEYBOARD_SHORTCUTS = [
  { key: "Space", action: "Show/Hide Answer" },
  { key: "←", action: "Previous Card" },
  { key: "→", action: "Next Card" },
  { key: "1", action: "Again (1m)" },
  { key: "2", action: "Hard (12h)" },
  { key: "3", action: "Good (1d)" },
  { key: "4", action: "Easy (4d)" },
  { key: "?", action: "Show Keyboard Shortcuts" },
]

export function FlashcardReview({ lessonId }: FlashcardReviewProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchFlashcards()
  }, [])

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault()
        setShowAnswer(!showAnswer)
      } else if (event.key === "ArrowLeft") {
        handlePreviousCard()
      } else if (event.key === "ArrowRight") {
        handleNextCard()
      } else if (event.key === "?") {
        setShowShortcuts(true)
      } else if (showAnswer && INTERVALS[Object.keys(INTERVALS)[Number(event.key) - 1]]) {
        handleInterval(Object.keys(INTERVALS)[Number(event.key) - 1])
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showAnswer])

  async function fetchFlashcards() {
    if (!lessonId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at")

      if (error) throw error
      setFlashcards(data || [])
    } catch (error) {
      console.error("Error fetching flashcards:", error)
      toast({
        title: "Error",
        description: "Failed to load flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleInterval = (intervalKey: string) => {
    // For now, we'll just move to the next card without saving progress
    handleNextCard()
  }

  if (loading) {
    return <div className="flex justify-center items-center p-6">Loading flashcards...</div>
  }

  if (flashcards.length === 0) {
    return <div className="flex justify-center items-center p-6">No flashcards available for this lesson.</div>
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Volume2 className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 space-y-2">
                      {KEYBOARD_SHORTCUTS.map(({ key, action }) => (
                        <div key={key} className="flex justify-between">
                          <kbd className="px-2 py-1 bg-muted rounded text-sm">{key}</kbd>
                          <span className="text-sm text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-4">{showAnswer ? "Answer" : "Question"}</h2>
            <p className="text-lg whitespace-pre-wrap">{showAnswer ? currentCard.answer : currentCard.question}</p>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="ghost" size="icon" onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextCard}
              disabled={currentCardIndex === flashcards.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} className="w-full" variant="outline">
              Show Answer (Space)
            </Button>
          ) : (
            <div className="flex justify-between w-full gap-2">
              {Object.entries(INTERVALS).map(([key, { label, value, className, key: shortcutKey }]) => (
                <Button
                  key={key}
                  onClick={() => handleInterval(key)}
                  variant="outline"
                  className={`flex-1 ${className}`}
                >
                  <span className="flex flex-col items-center">
                    <span>{label}</span>
                    <span className="text-xs opacity-70">
                      {value} ({shortcutKey})
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <Tabs defaultValue="explain">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explain">
              <MessageSquare className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="example">
              <BookOpen className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="memo">
              <Brain className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="visualize">
              <Image className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="explain" className="p-4">
            <h3 className="font-semibold mb-2">Explanation</h3>
            <p className="text-sm text-muted-foreground">Get a detailed explanation of this concept.</p>
          </TabsContent>
          <TabsContent value="example" className="p-4">
            <h3 className="font-semibold mb-2">Example</h3>
            <p className="text-sm text-muted-foreground">See practical examples of this concept.</p>
          </TabsContent>
          <TabsContent value="memo" className="p-4">
            <h3 className="font-semibold mb-2">Memorization</h3>
            <p className="text-sm text-muted-foreground">Get memory techniques and mnemonics.</p>
          </TabsContent>
          <TabsContent value="visualize" className="p-4">
            <h3 className="font-semibold mb-2">Visualization</h3>
            <p className="text-sm text-muted-foreground">See visual representations and diagrams.</p>
          </TabsContent>
        </Tabs>
      </div>

      {isCompleted && (
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle>Congratulations!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You've completed all flashcards for this lesson.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/student/home")} className="w-full">
              Return to Student Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

