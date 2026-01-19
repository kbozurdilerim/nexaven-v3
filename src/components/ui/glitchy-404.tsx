"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Glitchy404() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`text-9xl font-bold text-white ${glitch ? 'animate-pulse' : ''}`}>
        <span className="relative">
          4
          {glitch && (
            <>
              <span className="absolute top-0 left-0 text-red-500 animate-ping">4</span>
              <span className="absolute top-0 left-0 text-blue-500 animate-bounce">4</span>
            </>
          )}
        </span>
        <span className="relative mx-4">
          0
          {glitch && (
            <>
              <span className="absolute top-0 left-0 text-green-500 animate-spin">0</span>
              <span className="absolute top-0 left-0 text-yellow-500 animate-pulse">0</span>
            </>
          )}
        </span>
        <span className="relative">
          4
          {glitch && (
            <>
              <span className="absolute top-0 left-0 text-purple-500 animate-bounce">4</span>
              <span className="absolute top-0 left-0 text-pink-500 animate-ping">4</span>
            </>
          )}
        </span>
      </div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20"
        animate={{
          opacity: glitch ? [0, 1, 0] : 0,
          x: glitch ? [-2, 2, -2, 2, 0] : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}