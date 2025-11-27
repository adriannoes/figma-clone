"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"
import type { CanvasElement, Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CanvasProps {
  elements: CanvasElement[]
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  addElement: (type: CanvasElement["type"], x: number, y: number, width: number, height: number) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  zoom: number
  pan: { x: number; y: number }
  setPan: (pan: { x: number; y: number }) => void
}

interface DrawingState {
  isDrawing: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface DragState {
  isDragging: boolean
  elementId: string
  startX: number
  startY: number
  elementStartX: number
  elementStartY: number
}

interface ResizeState {
  isResizing: boolean
  elementId: string
  handle: string
  startX: number
  startY: number
  elementStartX: number
  elementStartY: number
  elementStartWidth: number
  elementStartHeight: number
}

export function Canvas({
  elements,
  selectedIds,
  setSelectedIds,
  activeTool,
  setActiveTool,
  addElement,
  updateElement,
  zoom,
  pan,
  setPan,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  })
  const [dragging, setDragging] = useState<DragState>({
    isDragging: false,
    elementId: "",
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
  })
  const [resizing, setResizing] = useState<ResizeState>({
    isResizing: false,
    elementId: "",
    handle: "",
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
    elementStartWidth: 0,
    elementStartHeight: 0,
  })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 })

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 }
      const rect = canvasRef.current.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      }
    },
    [pan, zoom],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return

      const coords = getCanvasCoordinates(e)

      if (activeTool === "hand") {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y })
        return
      }

      if (activeTool === "select") {
        const clickedOnCanvas = (e.target as HTMLElement).dataset.canvas === "true"
        if (clickedOnCanvas) {
          setSelectedIds([])
        }
        return
      }

      if (["rectangle", "ellipse", "line", "text", "frame"].includes(activeTool)) {
        setDrawing({
          isDrawing: true,
          startX: coords.x,
          startY: coords.y,
          currentX: coords.x,
          currentY: coords.y,
        })
      }
    },
    [activeTool, getCanvasCoordinates, pan, setSelectedIds],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStart.x
        const dy = e.clientY - panStart.y
        setPan({ x: panStart.panX + dx, y: panStart.panY + dy })
        return
      }

      if (drawing.isDrawing) {
        const coords = getCanvasCoordinates(e)
        setDrawing((prev) => ({ ...prev, currentX: coords.x, currentY: coords.y }))
        return
      }

      if (dragging.isDragging) {
        const coords = getCanvasCoordinates(e)
        const dx = coords.x - dragging.startX
        const dy = coords.y - dragging.startY
        updateElement(dragging.elementId, {
          x: dragging.elementStartX + dx,
          y: dragging.elementStartY + dy,
        })
        return
      }

      if (resizing.isResizing) {
        const coords = getCanvasCoordinates(e)
        const dx = coords.x - resizing.startX
        const dy = coords.y - resizing.startY

        let newX = resizing.elementStartX
        let newY = resizing.elementStartY
        let newWidth = resizing.elementStartWidth
        let newHeight = resizing.elementStartHeight

        if (resizing.handle.includes("e")) {
          newWidth = Math.max(20, resizing.elementStartWidth + dx)
        }
        if (resizing.handle.includes("w")) {
          newWidth = Math.max(20, resizing.elementStartWidth - dx)
          newX = resizing.elementStartX + dx
        }
        if (resizing.handle.includes("s")) {
          newHeight = Math.max(20, resizing.elementStartHeight + dy)
        }
        if (resizing.handle.includes("n")) {
          newHeight = Math.max(20, resizing.elementStartHeight - dy)
          newY = resizing.elementStartY + dy
        }

        updateElement(resizing.elementId, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        })
      }
    },
    [isPanning, panStart, setPan, drawing, getCanvasCoordinates, dragging, resizing, updateElement],
  )

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    if (drawing.isDrawing) {
      const x = Math.min(drawing.startX, drawing.currentX)
      const y = Math.min(drawing.startY, drawing.currentY)
      const width = Math.abs(drawing.currentX - drawing.startX)
      const height = Math.abs(drawing.currentY - drawing.startY)

      if (width > 5 || height > 5) {
        const type = activeTool === "frame" ? "frame" : (activeTool as CanvasElement["type"])
        addElement(type, x, y, Math.max(width, 20), Math.max(height, 20))
      }

      setDrawing({ isDrawing: false, startX: 0, startY: 0, currentX: 0, currentY: 0 })
    }

    if (dragging.isDragging) {
      setDragging({
        isDragging: false,
        elementId: "",
        startX: 0,
        startY: 0,
        elementStartX: 0,
        elementStartY: 0,
      })
    }

    if (resizing.isResizing) {
      setResizing({
        isResizing: false,
        elementId: "",
        handle: "",
        startX: 0,
        startY: 0,
        elementStartX: 0,
        elementStartY: 0,
        elementStartWidth: 0,
        elementStartHeight: 0,
      })
    }
  }, [isPanning, drawing, activeTool, addElement, dragging, resizing])

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, element: CanvasElement) => {
      e.stopPropagation()
      if (activeTool !== "select" || element.locked) return

      const coords = getCanvasCoordinates(e)
      setSelectedIds([element.id])
      setDragging({
        isDragging: true,
        elementId: element.id,
        startX: coords.x,
        startY: coords.y,
        elementStartX: element.x,
        elementStartY: element.y,
      })
    },
    [activeTool, getCanvasCoordinates, setSelectedIds],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, element: CanvasElement, handle: string) => {
      e.stopPropagation()
      if (element.locked) return

      const coords = getCanvasCoordinates(e)
      setResizing({
        isResizing: true,
        elementId: element.id,
        handle,
        startX: coords.x,
        startY: coords.y,
        elementStartX: element.x,
        elementStartY: element.y,
        elementStartWidth: element.width,
        elementStartHeight: element.height,
      })
    },
    [getCanvasCoordinates],
  )

  const renderElement = (element: CanvasElement) => {
    if (!element.visible) return null

    const isSelected = selectedIds.includes(element.id)
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      opacity: element.opacity / 100,
      transform: `rotate(${element.rotation}deg)`,
      cursor: activeTool === "select" && !element.locked ? "move" : "default",
    }

    const renderShape = () => {
      switch (element.type) {
        case "rectangle":
        case "frame":
          return (
            <div
              className="h-full w-full"
              style={{
                backgroundColor: element.fill,
                border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
                borderRadius: element.cornerRadius ?? 0,
              }}
            />
          )
        case "ellipse":
          return (
            <div
              className="h-full w-full rounded-full"
              style={{
                backgroundColor: element.fill,
                border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
              }}
            />
          )
        case "line":
          return (
            <svg className="h-full w-full overflow-visible">
              <line
                x1="0"
                y1={element.height / 2}
                x2={element.width}
                y2={element.height / 2}
                stroke={element.fill}
                strokeWidth={Math.max(element.strokeWidth, 2)}
              />
            </svg>
          )
        case "text":
          return (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                color: element.fill === "transparent" ? "#ffffff" : element.fill,
                fontSize: element.fontSize ?? 24,
                fontWeight: 500,
              }}
            >
              {element.text}
            </div>
          )
        default:
          return null
      }
    }

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        className={cn("group", element.locked && "pointer-events-none")}
      >
        {renderShape()}
        {isSelected && activeTool === "select" && (
          <>
            <div className="pointer-events-none absolute inset-0 border-2 border-primary" />
            {/* Resize handles */}
            {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => {
              const positions: Record<string, React.CSSProperties> = {
                nw: { top: -4, left: -4, cursor: "nwse-resize" },
                n: { top: -4, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
                ne: { top: -4, right: -4, cursor: "nesw-resize" },
                e: { top: "50%", right: -4, transform: "translateY(-50%)", cursor: "ew-resize" },
                se: { bottom: -4, right: -4, cursor: "nwse-resize" },
                s: { bottom: -4, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
                sw: { bottom: -4, left: -4, cursor: "nesw-resize" },
                w: { top: "50%", left: -4, transform: "translateY(-50%)", cursor: "ew-resize" },
              }
              return (
                <div
                  key={handle}
                  className="absolute h-2 w-2 rounded-full border-2 border-primary bg-background"
                  style={positions[handle]}
                  onMouseDown={(e) => handleResizeMouseDown(e, element, handle)}
                />
              )
            })}
          </>
        )}
      </div>
    )
  }

  const renderDrawingPreview = () => {
    if (!drawing.isDrawing) return null

    const x = Math.min(drawing.startX, drawing.currentX)
    const y = Math.min(drawing.startY, drawing.currentY)
    const width = Math.abs(drawing.currentX - drawing.startX)
    const height = Math.abs(drawing.currentY - drawing.startY)

    const style: React.CSSProperties = {
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      border: "2px dashed",
      borderColor: "var(--primary)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      pointerEvents: "none",
    }

    if (activeTool === "ellipse") {
      return <div style={{ ...style, borderRadius: "50%" }} />
    }

    return <div style={style} />
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative flex-1 overflow-hidden bg-canvas",
        activeTool === "hand" && "cursor-grab",
        isPanning && "cursor-grabbing",
      )}
      data-canvas="true"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Canvas content */}
      <div
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {elements.map(renderElement)}
        {renderDrawingPreview()}
      </div>

      {/* Coordinates display */}
      <div className="absolute bottom-2 right-2 rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
        {Math.round(pan.x)}, {Math.round(pan.y)}
      </div>
    </div>
  )
}
