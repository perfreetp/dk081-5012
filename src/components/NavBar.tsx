import { NavLink, useLocation } from "react-router-dom"
import { Package, Users, BookOpen, Clock } from "lucide-react"
import { motion } from "framer-motion"

const NAV_ITEMS = [
  { path: "/post", label: "发单", icon: Package },
  { path: "/group", label: "拼单", icon: Users },
  { path: "/rules", label: "规则", icon: BookOpen },
  { path: "/progress", label: "进度", icon: Clock },
]

export default function NavBar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 z-50">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
            >
              <div className="relative">
                <item.icon
                  size={22}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-orange-primary" : "text-slate-400"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-orange-primary" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
