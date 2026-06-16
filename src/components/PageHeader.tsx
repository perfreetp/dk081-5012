import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy-primary">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {right && <div>{right}</div>}
      </div>
    </motion.div>
  )
}
