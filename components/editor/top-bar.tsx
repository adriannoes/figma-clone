"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Play, Share2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface TopBarProps {
  zoom: number
  setZoom: (zoom: number) => void
}

export function TopBar({ zoom, setZoom }: TopBarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-toolbar px-2">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-xs font-bold text-primary-foreground">F</span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>New file</DropdownMenuItem>
            <DropdownMenuItem>Open file...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Save</DropdownMenuItem>
            <DropdownMenuItem>Export...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>New</DropdownMenuItem>
            <DropdownMenuItem>Import</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Undo</DropdownMenuItem>
            <DropdownMenuItem>Redo</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Paste</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Zoom in</DropdownMenuItem>
            <DropdownMenuItem>Zoom out</DropdownMenuItem>
            <DropdownMenuItem>Fit to screen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Untitled</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
            <ZoomOut className="h-3 w-3" />
          </Button>
          <span className="min-w-[48px] text-center text-xs text-foreground">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.min(5, zoom + 0.1))}>
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(1)}>
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Play className="h-4 w-4" />
        </Button>

        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  )
}
