import { motion } from "framer-motion"
import type { Scenario } from "@/types"
import { SCENARIO_LABELS, SCENARIO_ICONS } from "@/types"

interface ScenarioCardProps {
  scenario: Scenario
  selected: boolean
  onClick: () => void
}

const SCENARIO_COLORS: Record<Scenario, { bg: string; border: string; icon: string }> = {
  same_school: {
    bg: "bg-orange-primary/5",
    border: "border-orange-primary",
    icon: "text-orange-primary",
  },
  off_campus: {
    bg: "bg-mint/5",
    border: "border-mint",
    icon: "text-mint",
  },
  recycle: {
    bg: "bg-rose/5",
    border: "border-rose",
    icon: "text-rose",
  },
}

export function ScenarioCard({ scenario, selected, onClick }: ScenarioCardProps) {
  const colors = SCENARIO_COLORS[scenario]
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 flex-1
        ${selected ? `${colors.bg} ${colors.border} shadow-lg` : "bg-white border-slate-200"}`}
    >
      <span className={`text-2xl ${selected ? colors.icon : ""}`}>{SCENARIO_ICONS[scenario]}</span>
      <span
        className={`text-xs font-medium text-center leading-tight ${
          selected ? "text-navy-primary" : "text-slate-500"
        }`}
      >
        {SCENARIO_LABELS[scenario]}
      </span>
    </motion.button>
  )
}
