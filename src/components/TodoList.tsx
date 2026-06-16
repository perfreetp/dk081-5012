import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Check } from "lucide-react"

export function TodoList() {
  const { todos, toggleTodo } = useAppStore()

  if (todos.length === 0) return null

  const doneCount = todos.filter((t) => t.done).length
  const totalCount = todos.length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title mb-0">离校待办清单</h3>
        <span className="text-xs text-slate-400 font-mono">
          {doneCount}/{totalCount}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
        <motion.div
          className="bg-mint h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <motion.button
            key={todo.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleTodo(todo.id)}
            className={`flex items-center gap-3 w-full text-left py-2 px-1 rounded-lg transition-colors ${
              todo.done ? "opacity-50" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                todo.done ? "bg-mint border-mint" : "border-slate-300"
              }`}
            >
              {todo.done && <Check size={12} className="text-white" />}
            </div>
            <span
              className={`text-sm ${
                todo.done ? "line-through text-slate-400" : "text-navy-primary"
              }`}
            >
              {todo.content}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
