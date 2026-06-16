import { motion } from "framer-motion"
import type { Difficulty } from "@/types"
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/types"

interface DifficultyBadgeProps {
  difficulty: Difficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`tag ${DIFFICULTY_COLORS[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  )
}

interface TagBadgeProps {
  label: string
  color: string
  selected?: boolean
  onClick?: () => void
}

export function TagBadge({ label, color, selected, onClick }: TagBadgeProps) {
  const baseClass = onClick
    ? "cursor-pointer transition-all duration-200 active:scale-95"
    : ""
  const selectedClass = selected ? "ring-2 ring-orange-primary ring-offset-1" : ""
  return (
    <motion.span
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={`tag ${color} ${baseClass} ${selectedClass}`}
      onClick={onClick}
    >
      {label}
    </motion.span>
  )
}

interface FurnitureTagProps {
  label: string
  emoji: string
  selected?: boolean
  onClick?: () => void
}

export function FurnitureTag({ label, emoji, selected, onClick }: FurnitureTagProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${
          selected
            ? "bg-orange-primary text-white shadow-md shadow-orange-primary/25"
            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  )
}
