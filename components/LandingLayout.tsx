import type React from "react"
import { GraduationCap } from "lucide-react"
import Image from "next/image"

interface LandingLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  imageSrc: string
}

export function LandingLayout({ children, title, description, imageSrc }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col justify-center items-center">
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
      <div className="z-10 w-full max-w-6xl flex">
        <div className="w-1/2 p-8 text-white">
          <GraduationCap className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl">{description}</p>
          <div className="mt-8 relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image src={imageSrc || "/placeholder.svg"} alt="Featured Image" layout="fill" objectFit="cover" />
          </div>
        </div>
        <div className="w-1/2 bg-white rounded-lg shadow-xl p-8 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-6 text-lg">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Note: Update Input and Button components to have larger text and padding
// In the Input component file, add: className="text-lg p-3"
// In the Button component file, add: className="text-lg p-3"

