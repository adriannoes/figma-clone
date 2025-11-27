export type Tool = "select" | "rectangle" | "ellipse" | "line" | "text" | "hand" | "frame"

export interface CanvasElement {
  id: string
  type: "rectangle" | "ellipse" | "line" | "text" | "frame"
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  rotation: number
  name: string
  locked: boolean
  visible: boolean
  text?: string
  fontSize?: number
  cornerRadius?: number
}
