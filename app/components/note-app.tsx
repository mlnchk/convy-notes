import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { ChevronLeft, Plus } from 'lucide-react'
import { useState } from "react"

export default function NoteApp() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const dates = [
    "10 Jan 2024",
    "8 Jan 2024",
    "7 Jan 2024",
    "5 Jan 2024",
    "3 Jan 2024"
  ]

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="flex gap-4 md:gap-8 h-[calc(100vh-4rem)]">
        {/* Left Sidebar Card */}
        <Card className="w-80 flex flex-col bg-white overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">2024 Jan</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground px-4 py-2 h-auto"
              >
                New note
              </Button>
              {dates.map((date) => (
                <Button
                  key={date}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 h-auto ${
                    selectedDate === date
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="flex-1 bg-white p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Add Title"
              className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            />
            <textarea
              placeholder="Start your note"
              className="w-full h-[calc(100vh-16rem)] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

