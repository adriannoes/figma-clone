"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { CanvasElement } from "@/lib/types"
import {
  Square,
  Circle,
  Minus,
  Type,
  Frame,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Layers,
  Plus,
} from "lucide-react"
import { useState } from "react"

interface LayersPanelProps {
  elements: CanvasElement[]
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  reorderElement: (id: string, direction: "up" | "down" | "top" | "bottom") => void
}

const typeIcons: Record<string, React.ReactNode> = {
  rectangle: <Square className="h-3 w-3" />,
  ellipse: <Circle className="h-3 w-3" />,
  line: <Minus className="h-3 w-3" />,
  text: <Type className="h-3 w-3" />,
  frame: <Frame className="h-3 w-3" />,
}

export function LayersPanel({
  elements,
  selectedIds,
  setSelectedIds,
  updateElement,
  reorderElement,
}: LayersPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const reversedElements = [...elements].reverse()

  return (
    <div className="flex w-60 flex-col border-r border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Layers</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <ScrollArea className="flex-1">
          <div className="p-1">
            {reversedElements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Layers className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">No layers yet</p>
                <p className="text-xs text-muted-foreground/70">Draw shapes to add layers</p>
              </div>
            ) : (
              reversedElements.map((element) => (
                <div
                  key={element.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary",
                    selectedIds.includes(element.id) && "bg-secondary",
                  )}
                  onClick={() => setSelectedIds([element.id])}
                >
                  <span className="text-muted-foreground">{typeIcons[element.type]}</span>

                  {editingId === element.id ? (
                    <Input
                      className="h-5 flex-1 bg-input px-1 py-0 text-xs"
                      value={element.name}
                      onChange={(e) => updateElement(element.id, { name: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingId(null)
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1 truncate text-xs text-foreground"
                      onDoubleClick={() => setEditingId(element.id)}
                    >
                      {element.name}
                    </span>
                  )}

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateElement(element.id, { visible: !element.visible })
                      }}
                    >
                      {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateElement(element.id, { locked: !element.locked })
                      }}
                    >
                      {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
