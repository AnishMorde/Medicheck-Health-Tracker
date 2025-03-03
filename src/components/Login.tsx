"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        navigate("/home")
      }
    }

    checkSession()
  }, [navigate])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Enhanced Medical Animation Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Heartbeat Line Animation - Enhanced */}
        <div className="absolute top-1/4 left-0 right-0 h-1 flex items-center">
          <div className="w-full bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="40"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 L300,20 L320,5 L340,35 L360,20 L1200,20"
                fill="none"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="3"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                className="animate-[heartbeat_2.5s_ease-in-out_infinite]"
              />
            </svg>
          </div>
        </div>

        {/* Second Heartbeat Line - Added for more animation */}
        <div className="absolute top-3/4 left-0 right-0 h-1 flex items-center">
          <div className="w-full bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="40"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M1200,20 L900,20 L880,5 L860,35 L840,20 L0,20"
                fill="none"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="3"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                className="animate-[heartbeat_3.5s_ease-in-out_0.5s_infinite]"
              />
            </svg>
          </div>
        </div>

        {/* Floating Medical Icons - Increased opacity */}
        <div className="absolute top-1/3 left-1/6 w-12 h-12 text-blue-300 opacity-70 animate-[float_6s_ease-in-out_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z" />
          </svg>
        </div>

        <div className="absolute top-2/3 right-1/4 w-10 h-10 text-green-300 opacity-60 animate-[float_8s_ease-in-out_1s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 text-red-300 opacity-50 animate-[float_10s_ease-in-out_2s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Multiple DNA Helix Animations - Enhanced */}
        <div className="absolute top-10 right-20 opacity-40 animate-[float_15s_ease-in-out_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="200" viewBox="0 0 100 200">
            <path
              d="M30,0 Q50,25 70,50 Q50,75 30,100 Q50,125 70,150 Q50,175 30,200"
              fill="none"
              stroke="rgba(59, 130, 246, 0.7)"
              strokeWidth="2"
              className="animate-[dnaFloat_12s_linear_infinite]"
            />
            <path
              d="M70,0 Q50,25 30,50 Q50,75 70,100 Q50,125 30,150 Q50,175 70,200"
              fill="none"
              stroke="rgba(59, 130, 246, 0.7)"
              strokeWidth="2"
              className="animate-[dnaFloat_12s_linear_infinite]"
            />
            {/* DNA Rungs */}
            <line x1="30" y1="25" x2="70" y2="25" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1" />
            <line x1="30" y1="75" x2="70" y2="75" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1" />
            <line x1="30" y1="125" x2="70" y2="125" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1" />
            <line x1="30" y1="175" x2="70" y2="175" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1" />
          </svg>
        </div>

        {/* Second DNA Helix - Different position and color */}
        <div className="absolute bottom-20 left-20 opacity-40 animate-[float_18s_ease-in-out_2s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="160" viewBox="0 0 100 200">
            <path
              d="M30,0 Q50,25 70,50 Q50,75 30,100 Q50,125 70,150 Q50,175 30,200"
              fill="none"
              stroke="rgba(16, 185, 129, 0.7)"
              strokeWidth="2"
              className="animate-[dnaFloat_15s_linear_infinite]"
            />
            <path
              d="M70,0 Q50,25 30,50 Q50,75 70,100 Q50,125 30,150 Q50,175 70,200"
              fill="none"
              stroke="rgba(16, 185, 129, 0.7)"
              strokeWidth="2"
              className="animate-[dnaFloat_15s_linear_infinite]"
            />
            {/* DNA Rungs */}
            <line x1="30" y1="25" x2="70" y2="25" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="1" />
            <line x1="30" y1="75" x2="70" y2="75" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="1" />
            <line x1="30" y1="125" x2="70" y2="125" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="1" />
            <line x1="30" y1="175" x2="70" y2="175" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="1" />
          </svg>
        </div>

        {/* Third DNA Helix - Different position, size and color */}
        <div className="absolute top-40 left-40 opacity-35 animate-[float_12s_ease-in-out_1s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="120" viewBox="0 0 100 200">
            <path
              d="M30,0 Q50,25 70,50 Q50,75 30,100 Q50,125 70,150 Q50,175 30,200"
              fill="none"
              stroke="rgba(236, 72, 153, 0.6)"
              strokeWidth="2"
              className="animate-[dnaFloat_10s_linear_infinite]"
            />
            <path
              d="M70,0 Q50,25 30,50 Q50,75 70,100 Q50,125 30,150 Q50,175 70,200"
              fill="none"
              stroke="rgba(236, 72, 153, 0.6)"
              strokeWidth="2"
              className="animate-[dnaFloat_10s_linear_infinite]"
            />
            {/* DNA Rungs */}
            <line x1="30" y1="25" x2="70" y2="25" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="1" />
            <line x1="30" y1="75" x2="70" y2="75" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="1" />
            <line x1="30" y1="125" x2="70" y2="125" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="1" />
            <line x1="30" y1="175" x2="70" y2="175" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="1" />
          </svg>
        </div>

        {/* Cell Animations - Enhanced */}
        {/* Cell 1 */}
        <div className="absolute top-1/4 right-1/3 opacity-40 animate-[float_12s_ease-in-out_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="20" fill="rgba(59, 130, 246, 0.3)" />
            <circle cx="40" cy="45" r="6" fill="rgba(59, 130, 246, 0.6)" />
            <circle cx="60" cy="55" r="4" fill="rgba(59, 130, 246, 0.6)" />
            <circle cx="50" cy="65" r="5" fill="rgba(59, 130, 246, 0.6)" />
          </svg>
        </div>

        {/* Cell 2 */}
        <div className="absolute bottom-1/3 left-1/4 opacity-35 animate-[float_15s_ease-in-out_2s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="rgba(16, 185, 129, 0.2)"
              stroke="rgba(16, 185, 129, 0.5)"
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="25" fill="rgba(16, 185, 129, 0.25)" />
            <circle cx="40" cy="40" r="5" fill="rgba(16, 185, 129, 0.5)" />
            <circle cx="60" cy="40" r="4" fill="rgba(16, 185, 129, 0.5)" />
            <circle cx="50" cy="60" r="7" fill="rgba(16, 185, 129, 0.5)" />
            <circle cx="65" cy="55" r="3" fill="rgba(16, 185, 129, 0.5)" />
          </svg>
        </div>

        {/* Cell 3 - Red blood cell */}
        <div className="absolute top-2/3 right-1/5 opacity-40 animate-[float_18s_ease-in-out_4s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="rgba(239, 68, 68, 0.25)"
              stroke="rgba(239, 68, 68, 0.5)"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="rgba(239, 68, 68, 0.3)"
              stroke="rgba(239, 68, 68, 0.25)"
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="20" fill="rgba(239, 68, 68, 0.2)" />
          </svg>
        </div>

        {/* Cell 4 - White blood cell */}
        <div className="absolute top-1/2 left-1/6 opacity-35 animate-[float_20s_ease-in-out_3s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="rgba(255, 255, 255, 0.6)"
              stroke="rgba(156, 163, 175, 0.6)"
              strokeWidth="1"
            />
            <circle cx="35" cy="40" r="8" fill="rgba(156, 163, 175, 0.5)" />
            <circle cx="45" cy="60" r="7" fill="rgba(156, 163, 175, 0.5)" />
            <circle cx="60" cy="45" r="6" fill="rgba(156, 163, 175, 0.5)" />
            <circle cx="65" cy="65" r="5" fill="rgba(156, 163, 175, 0.5)" />
          </svg>
        </div>

        {/* Antibody Animation */}
        <div className="absolute bottom-1/4 right-1/3 opacity-40 animate-[float_18s_ease-in-out_1s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
            <path
              d="M40,20 L40,50 L20,80 M40,50 L60,80 M60,20 L60,50"
              fill="none"
              stroke="rgba(124, 58, 237, 0.6)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Virus Particle - Enhanced */}
        <div className="absolute top-3/4 left-2/3 opacity-40 animate-[spin_25s_linear_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="rgba(245, 158, 11, 0.3)" />
            <line x1="50" y1="10" x2="50" y2="30" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="50" y1="70" x2="50" y2="90" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="10" y1="50" x2="30" y2="50" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="70" y1="50" x2="90" y2="50" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="22" y1="22" x2="36" y2="36" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="64" y1="64" x2="78" y2="78" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="22" y1="78" x2="36" y2="64" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
            <line x1="64" y1="36" x2="78" y2="22" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
          </svg>
        </div>

        {/* Second Virus Particle - Added for more animation */}
        <div className="absolute top-1/4 right-1/6 opacity-30 animate-[spin_20s_linear_reverse_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="rgba(139, 92, 246, 0.3)" />
            <line x1="50" y1="10" x2="50" y2="30" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="50" y1="70" x2="50" y2="90" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="10" y1="50" x2="30" y2="50" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="70" y1="50" x2="90" y2="50" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="22" y1="22" x2="36" y2="36" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="64" y1="64" x2="78" y2="78" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="22" y1="78" x2="36" y2="64" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
            <line x1="64" y1="36" x2="78" y2="22" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
          </svg>
        </div>

        {/* Microscope View */}
        <div className="absolute bottom-10 left-1/2 opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(107, 114, 128, 0.4)" strokeWidth="2" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(107, 114, 128, 0.3)" strokeWidth="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(107, 114, 128, 0.3)" strokeWidth="1" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(107, 114, 128, 0.3)" strokeWidth="1" />
          </svg>
        </div>

        {/* Pulse Circles - Enhanced */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 rounded-full border border-blue-300 opacity-40 animate-[pulse_3s_ease-out_infinite]"></div>
          <div className="w-96 h-96 rounded-full border border-blue-300 opacity-30 animate-[pulse_3s_ease-out_0.75s_infinite]"></div>
          <div className="w-96 h-96 rounded-full border border-blue-300 opacity-20 animate-[pulse_3s_ease-out_1.5s_infinite]"></div>
          <div className="w-96 h-96 rounded-full border border-blue-300 opacity-10 animate-[pulse_3s_ease-out_2.25s_infinite]"></div>
        </div>

        {/* Neuron Animation - Enhanced */}
        <div className="absolute top-20 left-20 opacity-40 animate-[float_18s_ease-in-out_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 240 160">
            <circle cx="120" cy="80" r="20" fill="rgba(147, 197, 253, 0.5)" />
            <path d="M140,80 C180,40 220,120 240,80" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M140,80 C180,120 220,40 240,80" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M100,80 C60,40 20,120 0,80" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M100,80 C60,120 20,40 0,80" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M120,100 C160,140 80,160 120,160" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <path d="M120,60 C160,20 80,0 120,0" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="2" />
            <circle cx="220" cy="60" r="3" fill="rgba(147, 197, 253, 0.6)" />
            <circle cx="20" cy="100" r="3" fill="rgba(147, 197, 253, 0.6)" />
            <circle cx="100" cy="20" r="3" fill="rgba(147, 197, 253, 0.6)" />
            <circle cx="140" cy="140" r="3" fill="rgba(147, 197, 253, 0.6)" />
          </svg>
        </div>

        {/* Moving Particle Animation - Enhanced with more particles */}
        <div className="absolute w-full h-full">
          <div className="absolute h-2 w-2 rounded-full bg-blue-300 opacity-50 animate-[particleMove1_15s_linear_infinite]"></div>
          <div className="absolute h-2 w-2 rounded-full bg-green-300 opacity-50 animate-[particleMove2_20s_linear_3s_infinite]"></div>
          <div className="absolute h-2 w-2 rounded-full bg-red-300 opacity-50 animate-[particleMove3_12s_linear_5s_infinite]"></div>
          <div className="absolute h-1.5 w-1.5 rounded-full bg-purple-300 opacity-50 animate-[particleMove4_25s_linear_7s_infinite]"></div>
          <div className="absolute h-1.5 w-1.5 rounded-full bg-yellow-300 opacity-50 animate-[particleMove5_18s_linear_2s_infinite]"></div>
          <div className="absolute h-2 w-2 rounded-full bg-indigo-300 opacity-50 animate-[particleMove1_22s_linear_4s_infinite]"></div>
          <div className="absolute h-1.5 w-1.5 rounded-full bg-pink-300 opacity-50 animate-[particleMove3_17s_linear_8s_infinite]"></div>
          <div className="absolute h-1 w-1 rounded-full bg-cyan-300 opacity-50 animate-[particleMove2_14s_linear_1s_infinite]"></div>
          <div className="absolute h-1 w-1 rounded-full bg-amber-300 opacity-50 animate-[particleMove5_19s_linear_6s_infinite]"></div>
          <div className="absolute h-1 w-1 rounded-full bg-emerald-300 opacity-50 animate-[particleMove4_16s_linear_9s_infinite]"></div>
        </div>

        {/* Added DNA strand animation */}
        <div className="absolute bottom-1/3 right-1/4 opacity-40 animate-[float_22s_ease-in-out_3s_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="70" height="140" viewBox="0 0 100 200">
            <path
              d="M30,0 Q50,25 70,50 Q50,75 30,100 Q50,125 70,150 Q50,175 30,200"
              fill="none"
              stroke="rgba(79, 70, 229, 0.6)"
              strokeWidth="2"
              className="animate-[dnaFloat_14s_linear_infinite]"
            />
            <path
              d="M70,0 Q50,25 30,50 Q50,75 70,100 Q50,125 30,150 Q50,175 70,200"
              fill="none"
              stroke="rgba(79, 70, 229, 0.6)"
              strokeWidth="2"
              className="animate-[dnaFloat_14s_linear_infinite]"
            />
            {/* DNA Rungs */}
            <line x1="30" y1="25" x2="70" y2="25" stroke="rgba(79, 70, 229, 0.6)" strokeWidth="1" />
            <line x1="30" y1="75" x2="70" y2="75" stroke="rgba(79, 70, 229, 0.6)" strokeWidth="1" />
            <line x1="30" y1="125" x2="70" y2="125" stroke="rgba(79, 70, 229, 0.6)" strokeWidth="1" />
            <line x1="30" y1="175" x2="70" y2="175" stroke="rgba(79, 70, 229, 0.6)" strokeWidth="1" />
          </svg>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes dnaFloat {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          @keyframes pulse {
            0% { transform: scale(0); opacity: 0.6; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes heartbeat {
            0% { stroke-dashoffset: 1200; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes particleMove1 {
            0% { transform: translate(0%, 0%); }
            25% { transform: translate(100%, 30%); }
            50% { transform: translate(80%, 80%); }
            75% { transform: translate(10%, 50%); }
            100% { transform: translate(0%, 0%); }
          }
          @keyframes particleMove2 {
            0% { transform: translate(100%, 50%); }
            25% { transform: translate(50%, 100%); }
            50% { transform: translate(0%, 50%); }
            75% { transform: translate(50%, 0%); }
            100% { transform: translate(100%, 50%); }
          }
          @keyframes particleMove3 {
            0% { transform: translate(50%, 0%); }
            33% { transform: translate(0%, 70%); }
            66% { transform: translate(100%, 70%); }
            100% { transform: translate(50%, 0%); }
          }
          @keyframes particleMove4 {
            0% { transform: translate(20%, 20%); }
            25% { transform: translate(80%, 30%); }
            50% { transform: translate(60%, 80%); }
            75% { transform: translate(40%, 50%); }
            100% { transform: translate(20%, 20%); }
          }
          @keyframes particleMove5 {
            0% { transform: translate(70%, 30%); }
            33% { transform: translate(30%, 50%); }
            66% { transform: translate(60%, 70%); }
            100% { transform: translate(70%, 30%); }
          }
        `}</style>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl relative z-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text">MediCheck Health</h1>
          </div>
          <p className="text-slate-600 text-lg">Secure Patient Monitoring Portal</p>
        </div>

        {error && (
          <div className="p-3 flex items-center space-x-2 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-3.5 flex items-center justify-center space-x-3 rounded-xl text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-600">Authenticating...</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
          <p>Secure access to patient health records and vitals monitoring</p>
        </div>
      </div>
    </div>
  )
}

export default Login

