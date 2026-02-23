"use client"

import { useState } from "react"
import { LoginView } from "@/components/auth/LoginView"
import { SignUpView } from "@/components/auth/SignUpView"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setTimeout(() => setIsAnimating(false), 50)
    }, 200)
  }

  return (
    <div className="bg-gray-50 text-slate-900 antialiased min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Liquid Blobs */}
      <div className="absolute w-80 h-80 rounded-full bg-primary-5/80 -top-10 -left-10 animate-pulse mix-blend-multiply blur-[100px]" />
      <div className="absolute w-96 h-96 rounded-full bg-secondary-5/80 bottom-0 -right-20 mix-blend-multiply blur-[100px]" />
      <div className="absolute w-64 h-64 rounded-full bg-tertiary-5/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply blur-[100px]" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md p-4 flex flex-col items-center justify-center min-h-screen sm:min-h-0">
        <div className="w-full rounded-2xl p-6 sm:p-8 flex flex-col bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-xl">
          <div
            className={`transition-all duration-200 ease-in-out space-y-6 ${
              isAnimating 
                ? "opacity-0 scale-95" 
                : "opacity-100 scale-100"
            }`}
          >
            {isLogin ? (
              <LoginView key="login" onToggle={handleToggle} />
            ) : (
              <SignUpView key="signup" onToggle={handleToggle} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}