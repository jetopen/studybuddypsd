import Link from "next/link"
import { Book, ClapperboardIcon as ChalkboardTeacher } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingLayout } from "@/components/LandingLayout"

export default function Home() {
  return (
    <LandingLayout
      title="Welcome to Virtual Learning"
      description="Embark on a journey of knowledge and growth with our innovative online learning platform. Whether you're a student eager to learn or a teacher passionate about educating, we have the tools and resources to help you succeed."
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zib8dvnVY4uW6r5PovHtznOm6FxyEn.png"
    >
      <div className="grid grid-cols-1 gap-6 w-full max-w-md mx-auto">
        <Link href="/signup" passHref>
          <Button className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600">
            <Book className="mr-2" />
            <span className="text-xl font-semibold">Sign Up</span>
          </Button>
        </Link>
        <Link href="/signin" passHref>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            <ChalkboardTeacher className="mr-2" />
            <span className="text-xl font-semibold">Sign In</span>
          </Button>
        </Link>
      </div>
    </LandingLayout>
  )
}

