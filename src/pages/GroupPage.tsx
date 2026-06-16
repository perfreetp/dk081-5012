import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Truck, MapPin, Calendar, ChevronRight, X, Plus } from "lucide-react"
import type { GroupOrder, GroupStatus } from "@/types"
import { GROUP_STATUS_LABELS, STATUS_LABELS, SCENARIO_LABELS, DELIVERY_LABELS, DIFFICULTY_LABELS } from "@/types"
import { useAppStore } from "@/store/useAppStore"
import { PageHeader } from "@/components/PageHeader"
import { CAMPUSES } from "@/data/campus"

const STATUS_COLORS: Record<GroupStatus, string> = {
  forming: "bg-orange-primary/15 text-orange-primary",
  confirmed: "bg-mint/15 text-mint",
  delivering: "bg-blue-500/15 text-blue-500",
  completed: "bg-slate-400/15 text-slate-500",
}

type DateFilter = "today" | "tomorrow" | "custom"

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export default function GroupPage() {
  const { groupOrders, orders, currentUser, joinGroup, confirmGroup, createGroup, getOrderByGroup } = useAppStore()
  const [dateFilter, setDateFilter] = useState<DateFilter>("today")
  const [customDate, setCustomDate] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<GroupOrder | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newArea, setNewArea] = useState("")

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const filterDate = dateFilter === "today" ? formatDate(today) : dateFilter === "tomorrow" ? formatDate(tomorrow) : customDate

  const filtered = groupOrders.filter((g) => {
    if (filterDate && g.date !== filterDate) return false
    if (areaFilter && g.area !== areaFilter) return false
    return true
  })

  const userPendingOrders = orders.filter(
    (o) => o.userId === currentUser.id && o.status === "pending"
  )

  const canJoin = (group: GroupOrder) =>
    group.status === "forming" &&
    userPendingOrders.some((o) => o.campus === group.area && o.leaveDate === group.date)

  const handleJoin = (group: GroupOrder) => {
    const order = userPendingOrders.find((o) => o.campus === group.area && o.leaveDate === group.date)
    if (order) joinGroup(group.id, order.id)
  }

  const handleCreate = () => {
    if (!newDate || !newArea) return
    createGroup(newDate, newArea)
    setShowCreate(false)
    setNewDate("")
    setNewArea("")
  }

  const groupOrders_list = selectedGroup ? getOrderByGroup(selectedGroup.id) : []
  const totalItems = groupOrders_list.reduce((sum, o) => sum + o.items.length, 0)
  const isCreator = selectedGroup
    ? groupOrders_list.some((o) => o.userId === currentUser.id)
    : false

  return (
    <div className="phone-frame pb-20">
      <PageHeader title="拼单大厅" subtitle="一起搬，更划算" />

      <div className="px-5 py-3 space-y-3">
        <div className="flex gap-2">
          {(["today", "tomorrow", "custom"] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`tag transition-colors ${
                dateFilter === f
                  ? "bg-orange-primary text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {f === "today" ? "今天" : f === "tomorrow" ? "明天" : "自选"}
            </button>
          ))}
          {dateFilter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="input-field py-1 px-2 text-xs w-28"
            />
          )}
        </div>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="input-field py-2 text-sm"
        >
          <option value="">全部校区</option>
          {CAMPUSES.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="px-5 space-y-3">
        <AnimatePresence>
          {filtered.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedGroup(group)}
              className="card cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Calendar size={14} />{group.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} />{group.area}</span>
                </div>
                <span className={`tag ${STATUS_COLORS[group.status]}`}>
                  {GROUP_STATUS_LABELS[group.status]}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-orange-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{group.memberCount} / {group.maxCapacity} 人</span>
                    <span className="flex items-center gap-1"><Truck size={12} />¥{group.sharedFee}/人</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-orange-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(group.memberCount / group.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">点击查看详情</span>
                {canJoin(group) ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleJoin(group) }}
                    className="btn-primary py-1.5 px-4 text-xs"
                  >
                    加入拼单
                  </button>
                ) : (
                  <ChevronRight size={16} className="text-slate-300" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">暂无拼单，创建一个吧</div>
        )}
      </div>

      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setSelectedGroup(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-3xl max-h-[75vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-navy-primary">拼单详情</h2>
                <button onClick={() => setSelectedGroup(null)} className="p-1"><X size={20} className="text-slate-400" /></button>
              </div>

              <div className="px-5 py-3 space-y-3">
                {groupOrders_list.map((order) => (
                  <div key={order.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-primary">{order.building}</span>
                      <span className="tag bg-slate-200 text-slate-600">{SCENARIO_LABELS[order.scenario]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item) => (
                        <span key={item.id} className="tag bg-white text-slate-600 border border-slate-200">
                          {item.furnitureType}
                          <span className="tag bg-orange-primary/10 text-orange-primary text-[10px] ml-1 py-0 px-1.5">
                            {DIFFICULTY_LABELS[item.difficulty]}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{DELIVERY_LABELS[order.deliveryMode]}</span>
                      <span className="font-medium text-orange-primary">¥{order.price}</span>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-sm text-slate-500">共 {totalItems} 件家具</span>
                  <span className="text-sm font-bold text-orange-primary">
                    ¥{selectedGroup.sharedFee}/人 × {selectedGroup.memberCount}人
                  </span>
                </div>

                {isCreator && selectedGroup.status === "forming" && (
                  <button
                    onClick={() => { confirmGroup(selectedGroup.id); setSelectedGroup(null) }}
                    className="btn-primary w-full"
                  >
                    确认发车
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-navy-primary">创建拼单</h2>
                <button onClick={() => setShowCreate(false)} className="p-1"><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="space-y-3">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field"
                />
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="input-field"
                >
                  <option value="">选择校区</option>
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleCreate}
                  disabled={!newDate || !newArea}
                  className="btn-primary w-full"
                >
                  创建拼单
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-1/2 translate-x-[calc(240px-2rem)] w-12 h-12 bg-orange-primary text-white rounded-full shadow-lg shadow-orange-primary/30 flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  )
}
