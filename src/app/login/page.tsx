"use client"

import { useState } from "react"
import { LoginView } from "@/components/auth/LoginView"
import { SignUpView } from "@/components/auth/SignUpView"

type AuthMode = "login" | "signup"

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login")

  return (
    <div className="bg-gray-50 text-slate-900 antialiased min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Liquid Blobs */}
      <div className="absolute w-80 h-80 rounded-full bg-primary-5/80 -top-10 -left-10 animate-pulse mix-blend-multiply blur-[100px]" />
      <div className="absolute w-96 h-96 rounded-full bg-secondary-5/80 bottom-0 -right-20 mix-blend-multiply blur-[100px]" />
      <div className="absolute w-64 h-64 rounded-full bg-tertiary-5/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply blur-[100px]" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md p-4 flex flex-col items-center justify-center min-h-screen sm:min-h-0">
        <div className="w-full rounded-2xl p-6 sm:p-8 flex flex-col gap-6 bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-xl">
          {/* Toggle Tabs */}
          <div className="flex bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-primary-1 text-emerald-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-primary-1 text-emerald-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Conditional Render */}
          {mode === "login" ? <LoginView /> : <SignUpView />}
        </div>
      </main>
    </div>
  )
}