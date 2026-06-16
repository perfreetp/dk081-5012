import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MapPin, Calendar, Package, Copy, Check, User, Filter, ChevronRight } from "lucide-react"
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
import { CAMPUSES } from "@/data/campus"

const getFurnitureEmoji = (type: string) =>
  FURNITURE_TYPES.find((f) => f.label === type)?.emoji ?? "📦"

function getCountdown(leaveDate: string) {
  const diff = new Date(leaveDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function OrderDetail({ order }: { order: Order }) {
  const { reviews, initTodos, getTodosByOrder, currentUser } = useAppStore()
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const hasReview = reviews.some((r) => r.orderId === order.id)
  const showHandover = order.status === "delivering" || order.status === "completed"
  const todos = getTodosByOrder(order.id)
  const canManage = currentUser.isAdmin || order.userId === currentUser.id

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
            {expanded ? (
              <ChevronDown size={18} className="text-slate-400" />
            ) : (
              <ChevronRight size={18} className="text-slate-400" />
            )}
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
                  {order.studentName && (
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-mint shrink-0" />
                      <span className="text-navy-primary font-medium">{order.studentName}</span>
                      {order.studentPhone && (
                        <span className="text-slate-400 text-xs">{order.studentPhone}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span>{SCENARIO_ICONS[order.scenario]}</span>
                    <span className="text-navy-primary font-medium">
                      {SCENARIO_LABELS[order.scenario]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-orange-primary shrink-0" />
                    <span>
                      {order.campus} · {order.building}
                    </span>
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
                    <div className="text-sm text-slate-500 pl-[22px]">→ {order.newAddress}</div>
                  )}

                  <div className="border-t border-slate-100 pt-2.5 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <span className="text-lg leading-none mt-0.5">
                          {getFurnitureEmoji(item.furnitureType)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-navy-primary">
                              {item.furnitureType}
                            </span>
                            <DifficultyBadge difficulty={item.difficulty} />
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                          )}
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
                    {order.charity && (
                      <span className="tag bg-rose/15 text-rose">公益</span>
                    )}
                    {order.urgent && (
                      <span className="tag bg-honey/20 text-amber-700">加急</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showHandover && canManage && (
          <div className="card relative">
            <HandoverCode code={order.handoverCode} />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {copied ? (
                <Check size={12} className="text-mint" />
              ) : (
                <Copy size={12} />
              )}
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        )}

        {canManage && order.bargaining && <BargainChat orderId={order.id} />}

        {canManage && (
          <div className="card">
            <h3 className="section-title">离校待办清单</h3>
            {todos.length === 0 ? (
              <button
                onClick={() => initTodos(order.id, order.leaveDate)}
                className="btn-primary w-full text-sm"
              >
                生成待办清单
              </button>
            ) : (
              <TodoList orderId={order.id} />
            )}
          </div>
        )}

        {canManage && order.status === "completed" && !hasReview && (
          <div className="card">
            <h3 className="section-title">评价服务</h3>
            <ReviewForm orderId={order.id} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function AdminOrderList({ onSelect }: { onSelect: (order: Order) => void }) {
  const { getAllOrders } = useAppStore()
  const [filterCampus, setFilterCampus] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchName, setSearchName] = useState("")

  const allOrders = getAllOrders()

  const filtered = allOrders.filter((o) => {
    if (filterCampus && o.campus !== filterCampus) return false
    if (filterDate && o.leaveDate !== filterDate) return false
    if (filterStatus && o.status !== filterStatus) return false
    if (searchName) {
      const name = o.studentName || ""
      if (!name.includes(searchName)) return false
    }
    return true
  })

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-orange-primary" />
          <span className="text-sm font-medium text-navy-primary">筛选订单</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="relative">
            <select
              value={filterCampus}
              onChange={(e) => setFilterCampus(e.target.value)}
              className="input-field appearance-none pr-7 text-xs py-2"
            >
              <option value="">全部校区</option>
              {CAMPUSES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input-field text-xs py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field appearance-none pr-7 text-xs py-2"
            >
              <option value="">全部状态</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="搜索学生姓名"
            className="input-field text-xs py-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-400 px-1">
          共 {filtered.length} 条订单
        </p>
        {filtered.map((order) => (
          <motion.button
            key={order.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(order)}
            className="card w-full text-left flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-navy-primary truncate">
                  {order.studentName || order.building}
                </span>
                <span className={`tag text-[10px] ${
                  order.status === "completed"
                    ? "bg-slate-200 text-slate-500"
                    : order.status === "delivering"
                    ? "bg-blue-500/15 text-blue-600"
                    : order.status === "grouped"
                    ? "bg-mint/15 text-mint"
                    : "bg-orange-primary/15 text-orange-primary"
                }`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{order.campus} {order.building}</span>
                <span>·</span>
                <span>{order.leaveDate}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id} className="text-sm">
                    {getFurnitureEmoji(item.furnitureType)}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-slate-400">+{order.items.length - 3}</span>
                )}
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { getUserOrders, currentUser } = useAppStore()
  const userOrders = getUserOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedIdx, setSelectedIdx] = useState(0)

  const displayOrders = currentUser.isAdmin && selectedOrder
    ? [selectedOrder]
    : userOrders

  if (currentUser.isAdmin && viewMode === "list" && !selectedOrder) {
    return (
      <div className="phone-frame pb-20">
        <PageHeader
          title="订单管理"
          subtitle="管理员视角"
          right={
            <button
              onClick={() => {
                setSelectedOrder(userOrders[0] || null)
              }}
              className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg"
            >
              我的订单
            </button>
          }
        />
        <div className="px-5 py-3">
          <AdminOrderList
            onSelect={(o) => {
              setSelectedOrder(o)
              setSelectedIdx(0)
            }}
          />
        </div>
      </div>
    )
  }

  const isAdminViewingAll = currentUser.isAdmin && selectedOrder && viewMode === "list"
  const pageTitle = isAdminViewingAll
    ? "订单详情"
    : currentUser.isAdmin && !selectedOrder
    ? "我的订单"
    : "我的进度"
  const showBackToList = currentUser.isAdmin && selectedOrder && viewMode === "list"

  return (
    <div className="phone-frame pb-20">
      <PageHeader
        title={pageTitle}
        subtitle={currentUser.isAdmin ? "管理员视角" : "搬好家"}
        right={
          showBackToList ? (
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-1 text-xs text-orange-primary font-medium"
            >
              <ChevronDown size={12} className="rotate-90" />
              返回列表
            </button>
          ) : currentUser.isAdmin ? (
            <button
              onClick={() => {
                setViewMode("list")
                setSelectedOrder(null)
              }}
              className="text-xs text-orange-primary bg-orange-primary/10 px-2.5 py-1.5 rounded-lg font-medium"
            >
              管理全部
            </button>
          ) : undefined
        }
      />

      {displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Package size={48} strokeWidth={1.2} />
          <p className="mt-3 text-sm">暂无订单</p>
        </div>
      ) : (
        <>
          {displayOrders.length > 1 && (
            <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-none">
              {displayOrders.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedIdx(i)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    i === selectedIdx
                      ? "bg-orange-primary text-white shadow-sm"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {o.studentName || o.building} · {STATUS_LABELS[o.status]}
                </button>
              ))}
            </div>
          )}

          <div className="px-5">
            <OrderDetail order={displayOrders[selectedIdx]} />
          </div>
        </>
      )}
    </div>
  )
}
