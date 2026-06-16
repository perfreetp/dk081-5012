import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Send } from "lucide-react"

interface BargainChatProps {
  orderId: string
}

export function BargainChat({ orderId }: BargainChatProps) {
  const { bargains, addBargain, currentUser, orders } = useAppStore()
  const [input, setInput] = useState("")
  const orderBargains = bargains.filter((b) => b.orderId === orderId)
  const order = orders.find((o) => o.id === orderId)

  if (!order?.bargaining) return null

  const handleSend = () => {
    if (!input.trim()) return
    addBargain(orderId, input.trim(), "offer")
    setInput("")
  }

  const handleAccept = (bargainId: string) => {
    const bargain = bargains.find((b) => b.id === bargainId)
    if (bargain) {
      addBargain(orderId, "已接受报价", "accept")
    }
  }

  const handleReject = (bargainId: string) => {
    const bargain = bargains.find((b) => b.id === bargainId)
    if (bargain) {
      addBargain(orderId, "已拒绝报价", "reject")
    }
  }

  return (
    <div className="card">
      <h3 className="section-title">议价消息</h3>
      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {orderBargains.map((msg) => {
            const isMe = msg.fromUserId === currentUser.id
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    msg.type === "accept"
                      ? "bg-mint/20 text-mint"
                      : msg.type === "reject"
                      ? "bg-rose/20 text-rose"
                      : isMe
                      ? "bg-orange-primary text-white"
                      : "bg-slate-100 text-navy-primary"
                  }`}
                >
                  {msg.content}
                  {msg.type === "offer" && !isMe && order.userId === currentUser.id && (
                    <div className="flex gap-2 mt-1.5">
                      <button
                        onClick={() => handleAccept(msg.id)}
                        className="text-[10px] bg-mint/20 text-mint px-2 py-0.5 rounded-full"
                      >
                        接受
                      </button>
                      <button
                        onClick={() => handleReject(msg.id)}
                        className="text-[10px] bg-rose/20 text-rose px-2 py-0.5 rounded-full"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {orderBargains.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-2">暂无议价消息</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="输入议价金额或留言..."
          className="input-field flex-1"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 flex items-center justify-center bg-orange-primary text-white rounded-xl disabled:opacity-40"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  )
}
