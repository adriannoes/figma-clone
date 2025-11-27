"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Tool } from "@/lib/types"
import { MousePointer2, Square, Circle, Minus, Type, Hand, Frame, Pen, ImageIcon, MessageSquare } from "lucide-react"

interface ToolbarProps {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
}

const tools: { id: Tool; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { id: "select", icon: <MousePointer2 className="h-4 w-4" />, label: "Select", shortcut: "V" },
  { id: "frame", icon: <Frame className="h-4 w-4" />, label: "Frame", shortcut: "F" },
  { id: "rectangle", icon: <Square className="h-4 w-4" />, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: <Circle className="h-4 w-4" />, label: "Ellipse", shortcut: "O" },
  { id: "line", icon: <Minus className="h-4 w-4" />, label: "Line", shortcut: "L" },
  { id: "text", icon: <Type className="h-4 w-4" />, label: "Text", shortcut: "T" },
  { id: "hand", icon: <Hand className="h-4 w-4" />, label: "Hand", shortcut: "H" },
]

export function Toolbar({ activeTool, setActiveTool }: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex w-12 flex-col items-center gap-1 border-r border-border bg-toolbar py-2">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground",
                  activeTool === tool.id && "bg-secondary text-primary",
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {tool.label}
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{tool.shortcut}</kbd>
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="my-2 h-px w-6 bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Pen</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Image</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Comment</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
