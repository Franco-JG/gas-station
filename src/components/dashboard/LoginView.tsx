"use client"

import { useState } from "react"
import { LuMail, LuLock, LuEye, LuEyeOff, LuFuel } from "react-icons/lu"
import { FaGithub, FaGoogle } from "react-icons/fa"
import Link from "next/link"

export const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implementar login con credentials
    console.log({ email, password })
  }

  return (
    <div className="bg-gray-50 text-slate-900 antialiased min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Liquid Blobs */}
      <div className="absolute w-80 h-80 rounded-full bg-primary-5/80 -top-10 -left-10 animate-pulse mix-blend-multiply blur-[100px]" />
      <div className="absolute w-96 h-96 rounded-full bg-secondary-5/80 bottom-0 -right-20 mix-blend-multiply blur-[100px]" />
      <div className="absolute w-64 h-64 rounded-full bg-tertiary-5/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply blur-[100px]" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-md p-4 flex flex-col items-center justify-center min-h-screen sm:min-h-0">
        <div className="w-full rounded-2xl p-6 sm:p-8 flex flex-col gap-6 bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-1/10 text-primary-1 mb-2 border border-primary-1/20 shadow-sm">
              <LuFuel size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-title">Gas México</h1>
            <p className="text-sm text-slate-500">Bienvenido, inicia sesión para continuar.</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-title ml-1">Email</label>
              <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg flex items-center px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary-1/50 transition-all">
                <LuMail className="text-slate-400 mr-2" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-title placeholder-slate-400 text-sm w-full focus:outline-none"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-semibold text-title">Contraseña</label>
                <a className="text-xs text-primary-1 font-medium hover:text-primary-2 transition-colors" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg flex items-center px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary-1/50 transition-all">
                <LuLock className="text-slate-400 mr-2" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none text-title placeholder-slate-400 text-sm w-full focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex items-center cursor-pointer"
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-1 hover:bg-primary-2 text-emerald-950 font-bold h-12 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary-4/50 mt-2 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/50 backdrop-blur-sm px-2 text-slate-400 rounded-lg">
                O continúa con
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white/80 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer">
              <FaGoogle className="w-5 h-5 text-slate-700" />
              Google
            </button>
            <button className="bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white/80 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer">
              <FaGithub className="w-5 h-5 text-slate-700" />
              GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              ¿No tienes cuenta?{" "}
              <Link 
                href={"/"}
                className="text-primary-1 font-bold hover:underline">
                Crea una
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}