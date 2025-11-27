"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CanvasElement } from "@/lib/types"
import { Trash2, Copy, RotateCcw } from "lucide-react"

interface PropertiesPanelProps {
  selectedElements: CanvasElement[]
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  deleteElements: (ids: string[]) => void
  duplicateElements: (ids: string[]) => void
}

export function PropertiesPanel({
  selectedElements,
  updateElement,
  deleteElements,
  duplicateElements,
}: PropertiesPanelProps) {
  const element = selectedElements[0]

  if (!element) {
    return (
      <div className="flex w-64 flex-col border-l border-border bg-panel">
        <div className="border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-foreground">Design</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <p className="text-sm text-muted-foreground">Select an element to view its properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-64 flex-col border-l border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium text-foreground">Design</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => duplicateElements([element.id])}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => deleteElements([element.id])}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Position & Size */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Position</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  className="h-8 bg-input text-xs"
                  value={Math.round(element.x)}
                  onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  className="h-8 bg-input text-xs"
                  value={Math.round(element.y)}
                  onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">W</Label>
                <Input
                  type="number"
                  className="h-8 bg-input text-xs"
                  value={Math.round(element.width)}
                  onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">H</Label>
                <Input
                  type="number"
                  className="h-8 bg-input text-xs"
                  value={Math.round(element.height)}
                  onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Rotation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rotation</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => updateElement(element.id, { rotation: 0 })}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.rotation]}
                onValueChange={([value]) => updateElement(element.id, { rotation: value })}
                min={0}
                max={360}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                className="h-8 w-16 bg-input text-xs"
                value={element.rotation}
                onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
              />
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Corner Radius (for rectangles) */}
          {element.type === "rectangle" && (
            <>
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Corner Radius</h3>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[element.cornerRadius ?? 0]}
                    onValueChange={([value]) => updateElement(element.id, { cornerRadius: value })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    className="h-8 w-16 bg-input text-xs"
                    value={element.cornerRadius ?? 0}
                    onChange={(e) =>
                      updateElement(element.id, {
                        cornerRadius: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Separator className="bg-border" />
            </>
          )}

          {/* Fill */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fill</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded border border-border bg-transparent"
                  value={element.fill === "transparent" ? "#000000" : element.fill}
                  onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                />
              </div>
              <Input
                className="h-8 flex-1 bg-input text-xs uppercase"
                value={element.fill}
                onChange={(e) => updateElement(element.id, { fill: e.target.value })}
              />
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Stroke */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stroke</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded border border-border bg-transparent"
                  value={element.stroke === "transparent" ? "#000000" : element.stroke}
                  onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                />
              </div>
              <Input
                className="h-8 flex-1 bg-input text-xs uppercase"
                value={element.stroke}
                onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Width</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[element.strokeWidth]}
                  onValueChange={([value]) => updateElement(element.id, { strokeWidth: value })}
                  min={0}
                  max={20}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  className="h-8 w-16 bg-input text-xs"
                  value={element.strokeWidth}
                  onChange={(e) => updateElement(element.id, { strokeWidth: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Opacity */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Opacity</h3>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.opacity]}
                onValueChange={([value]) => updateElement(element.id, { opacity: value })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                className="h-8 w-16 bg-input text-xs"
                value={element.opacity}
                onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Text properties */}
          {element.type === "text" && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Text</h3>
                <Input
                  className="h-8 bg-input text-xs"
                  value={element.text ?? ""}
                  onChange={(e) => updateElement(element.id, { text: e.target.value })}
                  placeholder="Enter text..."
                />
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Font Size</Label>
                  <Input
                    type="number"
                    className="h-8 bg-input text-xs"
                    value={element.fontSize ?? 24}
                    onChange={(e) =>
                      updateElement(element.id, {
                        fontSize: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
