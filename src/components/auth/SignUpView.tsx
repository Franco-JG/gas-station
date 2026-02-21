"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { LuMail, LuLock, LuEye, LuEyeOff, LuFuel, LuUser } from "react-icons/lu"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { registerUser } from "./actions/actions"

export const SignUpView = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("El nombre es requerido")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const result = await registerUser(email, password, name)

      if (!result.success) {
        setError(result.error || "Error al crear la cuenta")
        return
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Cuenta creada, pero hubo un error al iniciar sesión")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Ocurrió un error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "github") => {
    signIn(provider, { redirect: true, callbackUrl: "/" })
  }

  return (
    <>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-1/10 text-primary-1 mb-2 border border-primary-1/20 shadow-sm">
          <LuFuel size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-title">Gas México</h1>
        <p className="text-sm text-slate-500">Crea tu cuenta para comenzar.</p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-title ml-1">Nombre</label>
          <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg flex items-center px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary-1/50 transition-all">
            <LuUser className="text-slate-400 mr-2" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-none text-title placeholder-slate-400 text-sm w-full focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
        </div>

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
          <label className="block text-sm font-semibold text-title ml-1">Contraseña</label>
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

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-title ml-1">Confirmar Contraseña</label>
          <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg flex items-center px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary-1/50 transition-all">
            <LuLock className="text-slate-400 mr-2" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-none text-title placeholder-slate-400 text-sm w-full focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors flex items-center cursor-pointer"
            >
              {showConfirmPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-1 hover:bg-primary-2 text-emerald-950 font-bold h-12 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary-4/50 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/50 backdrop-blur-sm px-2 text-slate-400 rounded-lg">
            O regístrate con
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSocialLogin("google")}
          type="button"
          className="bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white/80 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <FaGoogle className="w-5 h-5 text-slate-700" />
          Google
        </button>
        <button
          onClick={() => handleSocialLogin("github")}
          type="button"
          className="bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white/80 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <FaGithub className="w-5 h-5 text-slate-700" />
          GitHub
        </button>
      </div>
    </>
  )
}