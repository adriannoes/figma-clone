"use client"

import { useEffect, useRef } from "react"
import {
  Copy,
  Clipboard,
  Scissors,
  Trash2,
  CopyPlus,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react"
import type { CanvasElement } from "@/lib/types"

interface ContextMenuProps {
  x: number
  y: number
  selectedElements: CanvasElement[]
  onClose: () => void
  onCopy: () => void
  onCut: () => void
  onPaste: () => void
  onDuplicate: () => void
  onDelete: () => void
  onReorder: (direction: "up" | "down" | "top" | "bottom") => void
  onToggleLock: () => void
  onToggleVisibility: () => void
  hasClipboard: boolean
}

export function ContextMenu({
  x,
  y,
  selectedElements,
  onClose,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onDelete,
  onReorder,
  onToggleLock,
  onToggleVisibility,
  hasClipboard,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const hasSelection = selectedElements.length > 0
  const isLocked = selectedElements.some((el) => el.locked)
  const isHidden = selectedElements.some((el) => !el.visible)

  const menuItems = [
    {
      type: "group" as const,
      items: [
        { icon: Copy, label: "Copy", shortcut: "⌘C", action: onCopy, disabled: !hasSelection },
        { icon: Scissors, label: "Cut", shortcut: "⌘X", action: onCut, disabled: !hasSelection },
        { icon: Clipboard, label: "Paste", shortcut: "⌘V", action: onPaste, disabled: !hasClipboard },
        { icon: CopyPlus, label: "Duplicate", shortcut: "⌘D", action: onDuplicate, disabled: !hasSelection },
      ],
    },
    { type: "separator" as const },
    {
      type: "group" as const,
      items: [
        { icon: ChevronsUp, label: "Bring to Front", action: () => onReorder("top"), disabled: !hasSelection },
        { icon: ArrowUp, label: "Bring Forward", action: () => onReorder("up"), disabled: !hasSelection },
        { icon: ArrowDown, label: "Send Backward", action: () => onReorder("down"), disabled: !hasSelection },
        { icon: ChevronsDown, label: "Send to Back", action: () => onReorder("bottom"), disabled: !hasSelection },
      ],
    },
    { type: "separator" as const },
    {
      type: "group" as const,
      items: [
        {
          icon: isLocked ? Unlock : Lock,
          label: isLocked ? "Unlock" : "Lock",
          action: onToggleLock,
          disabled: !hasSelection,
        },
        {
          icon: isHidden ? Eye : EyeOff,
          label: isHidden ? "Show" : "Hide",
          action: onToggleVisibility,
          disabled: !hasSelection,
        },
      ],
    },
    { type: "separator" as const },
    {
      type: "group" as const,
      items: [
        { icon: Trash2, label: "Delete", shortcut: "⌫", action: onDelete, disabled: !hasSelection, danger: true },
      ],
    },
  ]

  return (
    <div
      ref={menuRef}
      className="absolute z-50 min-w-[180px] rounded-lg border border-border bg-popover py-1 shadow-lg"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => {
        if (item.type === "separator") {
          return <div key={index} className="my-1 h-px bg-border" />
        }

        return (
          <div key={index}>
            {item.items.map((menuItem, itemIndex) => (
              <button
                key={itemIndex}
                className={`flex w-full items-center gap-3 px-3 py-1.5 text-sm transition-colors ${
                  menuItem.disabled
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : menuItem.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-foreground hover:bg-accent"
                }`}
                onClick={() => {
                  if (!menuItem.disabled) {
                    menuItem.action()
                    onClose()
                  }
                }}
                disabled={menuItem.disabled}
              >
                <menuItem.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{menuItem.label}</span>
                {menuItem.shortcut && <span className="text-xs text-muted-foreground">{menuItem.shortcut}</span>}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}
