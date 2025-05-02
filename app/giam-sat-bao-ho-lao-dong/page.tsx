"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/giam-sat-an-toan-lao-dong")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Đang chuyển hướng...</p>
    </div>
  )
}
