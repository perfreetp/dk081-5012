import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, MapPin, Calendar, Package, Copy, Check } from "lucide-react"
import { SCENARIO_LABELS, SCENARIO_ICONS, DELIVERY_LABELS, STATUS_LABELS, FURNITURE_TYPES } from "@/types"
import type { Order } from "@/types"
import { useAppStore } from "@/store/useAppStore"
import { PageHeader } from "@/components/PageHeader"
import { Timeline } from "@/components/Timeline"
import { HandoverCode } from "@/components/HandoverCode"
import { TodoList } from "@/components/TodoList"
import { BargainChat } from "@/components/BargainChat"
import { ReviewForm } from "@/components/ReviewForm"
import { DifficultyBadge } from "@/components/Badges"

const getFurnitureEmoji = (type: string) =>
  FURNITURE_TYPES.find((f) => f.label === type)?.emoji ?? "📦"

function getCountdown(leaveDate: string) {
  const diff = new Date(leaveDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function OrderDetail({ order }: { order: Order }) {
  const { reviews, initTodos, getTodosByOrder } = useAppStore()
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const hasReview = reviews.some((r) => r.orderId === order.id)
  const showHandover = order.status === "delivering" || order.status === "completed"
  const todos = getTodosByOrder(order.id)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(order.handoverCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={order.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-3"
      >
        {getCountdown(order.leaveDate) > 0 && (
          <div className="bg-orange-primary text-white text-center py-2.5 rounded-2xl font-bold text-sm tracking-wide">
            离校倒计时 {getCountdown(order.leaveDate)} 天
          </div>
        )}

        <div className="card">
          <Timeline currentStatus={order.status} />
        </div>

        <div className="card">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="section-title mb-0">订单详情</h3>
            {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2.5 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{SCENARIO_ICONS[order.scenario]}</span>
                    <span className="text-navy-primary font-medium">{SCENARIO_LABELS[order.scenario]}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-orange-primary shrink-0" />
                    <span>{order.campus} · {order.building}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} className="text-orange-primary shrink-0" />
                    <span>{order.leaveDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package size={14} className="text-orange-primary shrink-0" />
                    <span>{DELIVERY_LABELS[order.deliveryMode]}</span>
                  </div>

                  {order.deliveryMode === "deliver" && order.newAddress && (
                    <div className="text-sm text-slate-500 pl-[22px]">
                      → {order.newAddress}
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-2.5 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <span className="text-lg leading-none mt-0.5">{getFurnitureEmoji(item.furnitureType)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-navy-primary">{item.furnitureType}</span>
                            <DifficultyBadge difficulty={item.difficulty} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 flex items-center gap-2 flex-wrap">
                    {order.charity ? (
                      <span className="text-rose font-bold text-base">公益转赠</span>
                    ) : (
                      <span className="text-navy-primary font-bold text-base">¥{order.price}</span>
                    )}
                    {order.charity && <span className="tag bg-rose/15 text-rose">公益</span>}
                    {order.urgent && <span className="tag bg-honey/20 text-amber-700">加急</span>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showHandover && (
          <div className="card relative">
            <HandoverCode code={order.handoverCode} />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        )}

        {order.bargaining && <BargainChat orderId={order.id} />}

        <div className="card">
          <h3 className="section-title">离校待办清单</h3>
          {todos.length === 0 ? (
            <button onClick={() => initTodos(order.id, order.leaveDate)} className="btn-primary w-full text-sm">
              生成待办清单
            </button>
          ) : (
            <TodoList orderId={order.id} />
          )}
        </div>

        {order.status === "completed" && !hasReview && (
          <div className="card">
            <h3 className="section-title">评价服务</h3>
            <ReviewForm orderId={order.id} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProgressPage() {
  const { getUserOrders } = useAppStore()
  const orders = getUserOrders()
  const [selectedIdx, setSelectedIdx] = useState(0)

  return (
    <div className="phone-frame pb-20">
      <PageHeader title="我的进度" subtitle="搬好家" />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Package size={48} strokeWidth={1.2} />
          <p className="mt-3 text-sm">暂无订单</p>
        </div>
      ) : (
        <>
          {orders.length > 1 && (
            <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-none">
              {orders.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedIdx(i)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    i === selectedIdx
                      ? "bg-orange-primary text-white shadow-sm"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {o.building} · {STATUS_LABELS[o.status]}
                </button>
              ))}
            </div>
          )}

          <div className="px-5">
            <OrderDetail order={orders[selectedIdx]} />
          </div>
        </>
      )}
    </div>
  )
}
