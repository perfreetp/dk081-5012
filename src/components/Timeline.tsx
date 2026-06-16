import { motion } from "framer-motion"
import type { OrderStatus } from "@/types"
import { STATUS_LABELS } from "@/types"
import { Check } from "lucide-react"

interface TimelineProps {
  currentStatus: OrderStatus
}

const STEPS: OrderStatus[] = ["pending", "grouped", "delivering", "completed"]

export function Timeline({ currentStatus }: TimelineProps) {
  const currentIndex = STEPS.indexOf(currentStatus)

  return (
    <div className="flex items-center gap-0 px-2">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted
                    ? "#2EC4B6"
                    : isCurrent
                    ? "#FF6B35"
                    : "#E9ECEF",
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrent ? "animate-pulse-ring" : ""
                }`}
              >
                {isCompleted ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <span
                    className={`text-[10px] font-bold ${
                      isCurrent ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isCurrent
                    ? "text-orange-primary"
                    : isCompleted
                    ? "text-mint"
                    : "text-slate-400"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-1">
                <div
                  className={`h-0.5 rounded-full transition-colors duration-500 ${
                    i < currentIndex ? "bg-mint" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
