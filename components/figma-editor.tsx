"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TopBar } from "./editor/top-bar"
import { Toolbar } from "./editor/toolbar"
import { Canvas } from "./editor/canvas"
import { LayersPanel } from "./editor/layers-panel"
import { PropertiesPanel } from "./editor/properties-panel"
import type { CanvasElement, Tool } from "@/lib/types"
import { generateId } from "@/lib/utils"

export type AlignmentType = "left" | "center" | "right" | "top" | "middle" | "bottom"

export function FigmaEditor() {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const clipboardRef = useRef<CanvasElement[]>([])
  const [hasClipboard, setHasClipboard] = useState(false)

  const selectedElements = elements.filter((el) => selectedIds.includes(el.id))

  const addElement = useCallback(
    (type: CanvasElement["type"], x: number, y: number, width: number, height: number) => {
      const newElement: CanvasElement = {
        id: generateId(),
        type,
        x,
        y,
        width,
        height,
        fill: type === "text" ? "transparent" : "#6366f1",
        stroke: "transparent",
        strokeWidth: 0,
        opacity: 100,
        rotation: 0,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`,
        locked: false,
        visible: true,
        text: type === "text" ? "Text" : undefined,
        fontSize: type === "text" ? 24 : undefined,
        cornerRadius: type === "rectangle" ? 0 : undefined,
      }
      setElements((prev) => [...prev, newElement])
      setSelectedIds([newElement.id])
      setActiveTool("select")
    },
    [elements.length],
  )

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }, [])

  const deleteElements = useCallback((ids: string[]) => {
    setElements((prev) => prev.filter((el) => !ids.includes(el.id)))
    setSelectedIds([])
  }, [])

  const duplicateElements = useCallback(
    (ids: string[]) => {
      const newElements = elements
        .filter((el) => ids.includes(el.id))
        .map((el) => ({
          ...el,
          id: generateId(),
          x: el.x + 20,
          y: el.y + 20,
          name: `${el.name} copy`,
        }))
      setElements((prev) => [...prev, ...newElements])
      setSelectedIds(newElements.map((el) => el.id))
    },
    [elements],
  )

  const reorderElement = useCallback((id: string, direction: "up" | "down" | "top" | "bottom") => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id)
      if (index === -1) return prev
      const newElements = [...prev]
      const [element] = newElements.splice(index, 1)
      switch (direction) {
        case "up":
          newElements.splice(Math.min(index + 1, newElements.length), 0, element)
          break
        case "down":
          newElements.splice(Math.max(index - 1, 0), 0, element)
          break
        case "top":
          newElements.push(element)
          break
        case "bottom":
          newElements.unshift(element)
          break
      }
      return newElements
    })
  }, [])

  const alignElements = useCallback((ids: string[], alignment: AlignmentType) => {
    if (ids.length === 0) return

    setElements((prev) => {
      const selectedEls = prev.filter((el) => ids.includes(el.id))
      if (selectedEls.length === 0) return prev

      // Calculate bounding box of all selected elements
      const bounds = {
        minX: Math.min(...selectedEls.map((el) => el.x)),
        maxX: Math.max(...selectedEls.map((el) => el.x + el.width)),
        minY: Math.min(...selectedEls.map((el) => el.y)),
        maxY: Math.max(...selectedEls.map((el) => el.y + el.height)),
      }

      return prev.map((el) => {
        if (!ids.includes(el.id)) return el

        let newX = el.x
        let newY = el.y

        switch (alignment) {
          case "left":
            newX = bounds.minX
            break
          case "center":
            newX = bounds.minX + (bounds.maxX - bounds.minX) / 2 - el.width / 2
            break
          case "right":
            newX = bounds.maxX - el.width
            break
          case "top":
            newY = bounds.minY
            break
          case "middle":
            newY = bounds.minY + (bounds.maxY - bounds.minY) / 2 - el.height / 2
            break
          case "bottom":
            newY = bounds.maxY - el.height
            break
        }

        return { ...el, x: newX, y: newY }
      })
    })
  }, [])

  const handleCopy = useCallback(() => {
    const elementsToCopy = elements.filter((el) => selectedIds.includes(el.id))
    clipboardRef.current = elementsToCopy
    setHasClipboard(elementsToCopy.length > 0)
  }, [elements, selectedIds])

  const handleCut = useCallback(() => {
    const elementsToCut = elements.filter((el) => selectedIds.includes(el.id))
    clipboardRef.current = elementsToCut
    setHasClipboard(elementsToCut.length > 0)
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)))
    setSelectedIds([])
  }, [elements, selectedIds])

  const handlePaste = useCallback(() => {
    if (clipboardRef.current.length === 0) return

    const newElements = clipboardRef.current.map((el) => ({
      ...el,
      id: generateId(),
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name} copy`,
    }))
    setElements((prev) => [...prev, ...newElements])
    setSelectedIds(newElements.map((el) => el.id))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          deleteElements(selectedIds)
        }
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (selectedIds.length > 0) {
          duplicateElements(selectedIds)
        }
      }
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const selectableIds = elements.filter((el) => !el.locked).map((el) => el.id)
        setSelectedIds(selectableIds)
      }
      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleCopy()
      }
      if (e.key === "x" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleCut()
      }
      if (e.key === "v" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handlePaste()
      }
      if (e.key === "Escape") {
        setSelectedIds([])
        setActiveTool("select")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIds, deleteElements, duplicateElements, elements, handleCopy, handleCut, handlePaste])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopBar zoom={zoom} setZoom={setZoom} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="flex flex-1 overflow-hidden">
          <LayersPanel
            elements={elements}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            updateElement={updateElement}
            reorderElement={reorderElement}
          />
          <Canvas
            elements={elements}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            addElement={addElement}
            updateElement={updateElement}
            deleteElements={deleteElements}
            duplicateElements={duplicateElements}
            reorderElement={reorderElement}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            hasClipboard={hasClipboard}
            zoom={zoom}
            pan={pan}
            setPan={setPan}
          />
          <PropertiesPanel
            selectedElements={selectedElements}
            updateElement={updateElement}
            deleteElements={deleteElements}
            duplicateElements={duplicateElements}
            alignElements={alignElements}
          />
        </div>
      </div>
    </div>
  )
}
