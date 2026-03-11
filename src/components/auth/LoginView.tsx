"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu"
import { FaGasPump } from "react-icons/fa6";
import { FaGithub, FaGoogle } from "react-icons/fa"
import { sileo } from "sileo"

interface Props {
  onToggle: () => void
}

export const LoginView = ({ onToggle }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    let errorMessage = ""
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        errorMessage = ("Credenciales inválidas")
      }else{
        router.push("/")
        // router.refresh()
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
    } finally {
      setLoading(false)
      if (errorMessage) {
        sileo.error({
          title: "Error",
          description: errorMessage
        })
      }
    }
  }

  const handleSocialLogin = (provider: "google" | "github") => {
    signIn(provider, { redirect: true, callbackUrl: "/" })
  }

  return (
    <>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-1/10 text-primary-1 border border-primary-1/20 shadow-sm">
            <FaGasPump size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-title">Gas México</h1>
        </div>
        <p className="text-xs text-tertiary-4">Inicia sesión en tu cuenta.</p>
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
              className="bg-transparent border-none text-title placeholder-tertiary-4 text-sm w-full focus:outline-none"
              placeholder="user@example.com"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1 mr-1">
            <label className="block text-sm font-semibold text-title">Contraseña</label>
            <Link href="#" className="text-xs text-primary-1 font-semibold hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg flex items-center px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary-1/50 transition-all">
            <LuLock className="text-slate-400 mr-2" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none text-title placeholder-tertiary-4 text-sm w-full focus:outline-none"
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
          disabled={loading}
          className="w-full bg-primary-1 hover:bg-primary-2 text-emerald-950 font-bold h-12 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary-4/50 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/50 backdrop-blur-sm px-2 text-tertiary-4 rounded-lg">
            O ingresa con
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

      <div className="flex justify-center">
        <span className="text-tertiary-4 text-xs">¿Aun no tienes cuenta?</span>
        <button
          onClick={onToggle}
          className="text-primary-1 text-xs font-bold hover:underline ml-1">
          Regístrate aquí
        </button>
      </div>
    </>
  )
}