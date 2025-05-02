"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TelegramNotificationButtonProps {
  violationType: string
  violationId: string
  severity: "high" | "medium" | "low"
  location: string
  person: string
  time: string
}

export function TelegramNotificationButton({
  violationType,
  violationId,
  severity,
  location,
  person,
  time,
}: TelegramNotificationButtonProps) {
  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = async () => {
    setIsSending(true)

    // Mô phỏng gửi thông báo đến Telegram
    try {
      // Trong thực tế, đây sẽ là một API call đến backend để gửi thông báo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Thông báo đã được gửi",
        description: `Đã gửi cảnh báo về vi phạm "${violationType}" qua Telegram.`,
      })
    } catch (error) {
      toast({
        title: "Lỗi khi gửi thông báo",
        description: "Không thể gửi thông báo qua Telegram. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendNotification}
            disabled={isSending}
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Đang gửi..." : "Gửi Telegram"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gửi thông báo vi phạm qua Telegram</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
