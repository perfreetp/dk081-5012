import { motion } from "framer-motion"

interface HandoverCodeProps {
  code: string
  revealed?: boolean
}

export function HandoverCode({ code, revealed = true }: HandoverCodeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-2 py-4"
    >
      <span className="text-xs text-slate-400 font-medium">交接码</span>
      <div className="flex gap-2">
        {code.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
            className="w-12 h-14 flex items-center justify-center bg-navy-primary text-white text-2xl font-mono font-bold rounded-xl"
          >
            {revealed ? char : "•"}
          </motion.span>
        ))}
      </div>
      <span className="text-[10px] text-slate-400">向师傅出示此码完成交接</span>
    </motion.div>
  )
}
