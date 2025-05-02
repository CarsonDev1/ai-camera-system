import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
            {description && (
              <span className="text-sm text-muted-foreground">
                {">"} {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <div className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HlXrNaazymzQUuOnwaT1ETf0Ivuhq1.png"
              alt="Intersnack Logo"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
