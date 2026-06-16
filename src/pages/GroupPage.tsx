import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Truck, MapPin, Calendar, ChevronRight, X, Plus, ChevronDown, Check } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { PageHeader } from "@/components/PageHeader"
import { DifficultyBadge } from "@/components/Badges"
import { GROUP_STATUS_LABELS, SCENARIO_LABELS, FURNITURE_TYPES } from "@/types"
import type { GroupOrder, Order } from "@/types"
import { CAMPUSES } from "@/data/campus"

const STATUS_COLORS: Record<string, string> = {
  forming: "bg-orange-primary/15 text-orange-primary",
  confirmed: "bg-mint/15 text-mint",
  delivering: "bg-blue-500/15 text-blue-600",
  completed: "bg-slate-200 text-slate-500",
}

function getFurnitureEmoji(type: string) {
  return FURNITURE_TYPES.find(f => f.label === type)?.emoji ?? "📦"
}

function GroupCard({ group, onOpen, canJoin, onJoin, isAdmin }: {
  group: GroupOrder
  onOpen: () => void
  canJoin: boolean
  onJoin: () => void
  isAdmin: boolean
}) {
  const orders = useAppStore.getState().getOrderByGroup(group.id)
  const totalItems = orders.reduce((sum, o) => sum + o.items.length, 0)

  return (
    <motion.div layout className="card" onClick={onOpen}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-orange-primary" />
          <span className="text-sm font-bold text-navy-primary">{group.date}</span>
        </div>
        <span className={`tag ${STATUS_COLORS[group.status]}`}>
          {GROUP_STATUS_LABELS[group.status]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
        <MapPin size={14} className="text-mint" />
        <span>{group.area}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="flex items-center gap-1">
            <Users size={12} /> {group.memberCount}/{group.maxCapacity}人
          </span>
          <span className="flex items-center gap-1">
            <Truck size={12} /> ¥{group.sharedFee}/人
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(group.memberCount / group.maxCapacity) * 100}%` }}
            className={`h-2 rounded-full ${group.memberCount >= group.maxCapacity ? "bg-mint" : "bg-orange-primary"}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">共 {totalItems} 件家具</span>
        <div className="flex items-center gap-2">
          {canJoin && group.status === "forming" && !isAdmin && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onJoin() }}
              className="btn-primary !py-1.5 !px-3 text-xs"
            >
              加入
            </motion.button>
          )}
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      </div>
    </motion.div>
  )
}

function GroupDrawer({ group, onClose, isAdmin }: {
  group: GroupOrder
  onClose: () => void
  isAdmin: boolean
}) {
  const { getOrderByGroup, confirmGroup } = useAppStore()
  const orders = getOrderByGroup(group.id)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-2xl max-h-[75vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h3 className="font-bold text-navy-primary">{group.area} · {group.date}</h3>
            <button onClick={onClose} className="p-1">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="text-lg font-bold text-navy-primary">{group.memberCount}</p>
                <p className="text-[10px] text-slate-400">参与人数</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="text-lg font-bold text-orange-primary">¥{group.sharedFee}</p>
                <p className="text-[10px] text-slate-400">人均费用</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="text-lg font-bold text-mint">
                  {orders.reduce((s, o) => s + o.items.length, 0)}
                </p>
                <p className="text-[10px] text-slate-400">家具件数</p>
              </div>
            </div>

            <p className="text-sm font-medium text-navy-primary">订单列表</p>
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy-primary">
                      {order.studentName || "我"}
                    </span>
                    <span className="text-xs text-slate-400">{order.building}</span>
                  </div>
                  <span className="text-xs text-slate-500">{SCENARIO_LABELS[order.scenario]}</span>
                </div>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <span>{getFurnitureEmoji(item.furnitureType)}</span>
                      <span className="text-slate-600">{item.furnitureType}</span>
                      <DifficultyBadge difficulty={item.difficulty} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-white">
            {isAdmin && group.status === "forming" && orders.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { confirmGroup(group.id); onClose() }}
                className="btn-primary w-full"
              >
                确认发车
              </motion.button>
            )}
            {!isAdmin && group.status === "forming" && (
              <button className="w-full py-2.5 text-sm text-slate-400">拼单中，等待凑齐</button>
            )}
            {group.status === "confirmed" && (
              <button className="w-full py-2.5 text-sm text-mint font-medium">已确认，等待配送</button>
            )}
            {group.status === "delivering" && (
              <button className="w-full py-2.5 text-sm text-orange-primary font-medium">配送中</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function MergePanel({ onClose }: { onClose: () => void }) {
  const { getPendingOrdersByDateAndCampus, createGroup, mergeOrdersToGroup, groupOrders } = useAppStore()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState("")
  const [campusId, setCampusId] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [targetGroup, setTargetGroup] = useState<string>("")

  const campus = CAMPUSES.find(c => c.id === campusId)?.name || ""
  const pendingOrders = getPendingOrdersByDateAndCampus(date, campus)
  const availableGroups = groupOrders.filter(g => g.date === date && g.area === campus && g.status === "forming")

  const toggleOrder = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleNext = () => {
    if (date && campus) setStep(2)
  }

  const handleMerge = () => {
    if (selected.length === 0) return
    let groupId = targetGroup
    if (!groupId) {
      groupId = createGroup(date, campus)
    }
    mergeOrdersToGroup(groupId, selected)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="text-slate-400">
                  <ChevronDown size={18} className="rotate-90" />
                </button>
              )}
              <h3 className="font-bold text-navy-primary">
                {step === 1 ? "选择日期和校区" : "合并订单到一车"}
              </h3>
            </div>
            <button onClick={onClose} className="p-1">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            {step === 1 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">选择要合并的日期和校区</p>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input-field"
                />
                <div className="relative">
                  <select
                    value={campusId}
                    onChange={e => setCampusId(e.target.value)}
                    className="input-field appearance-none pr-8 w-full"
                  >
                    <option value="">选择校区</option>
                    {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-2">选择目标拼单（可选已有拼单或新建）</p>
                  <div className="relative">
                    <select
                      value={targetGroup}
                      onChange={e => setTargetGroup(e.target.value)}
                      className="input-field appearance-none pr-8 w-full text-sm"
                    >
                      <option value="">新建拼单</option>
                      {availableGroups.map(g => (
                        <option key={g.id} value={g.id}>{g.id} ({g.memberCount}/{g.maxCapacity}人)</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">选择要合并的订单</p>
                    <span className="text-xs text-orange-primary font-medium">已选 {selected.length} 单</span>
                  </div>
                  {pendingOrders.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-6">同日同校区暂无待拼单订单</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingOrders.map(order => (
                        <motion.button
                          key={order.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleOrder(order.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            selected.includes(order.id)
                              ? "border-orange-primary bg-orange-primary/5"
                              : "border-slate-100 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                              selected.includes(order.id) ? "bg-orange-primary border-orange-primary" : "border-slate-300"
                            }`}>
                              {selected.includes(order.id) && <Check size={12} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-navy-primary">
                                  {order.studentName || order.building}
                                </span>
                                <span className="text-xs text-slate-400">{order.building}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {order.items.map(i => i.furnitureType).join("、")}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-slate-100">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={step === 1 ? handleNext : handleMerge}
              disabled={step === 1 ? (!date || !campusId) : selected.length === 0}
              className="btn-primary w-full"
            >
              {step === 1 ? "下一步" : `合并 ${selected.length} 单到拼车`}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function GroupPage() {
  const { groupOrders, currentUser, getUserOrders, joinGroup, createGroup } = useAppStore()
  const [filterDate, setFilterDate] = useState("")
  const [filterCampus, setFilterCampus] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<GroupOrder | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showMerge, setShowMerge] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newCampus, setNewCampus] = useState("")

  const userOrders = getUserOrders()

  const filteredGroups = groupOrders.filter(g => {
    if (filterDate && g.date !== filterDate) return false
    if (filterCampus && g.area !== filterCampus) return false
    return true
  })

  const canJoinGroup = (group: GroupOrder) => {
    return userOrders.some(
      o => o.leaveDate === group.date && o.campus === group.area && o.status === "pending"
    )
  }

  const handleJoin = (group: GroupOrder) => {
    const matchingOrder = userOrders.find(
      o => o.leaveDate === group.date && o.campus === group.area && o.status === "pending"
    )
    if (matchingOrder) {
      joinGroup(group.id, matchingOrder.id)
    }
  }

  const handleCreate = () => {
    if (!newDate || !newCampus) return
    createGroup(newDate, CAMPUSES.find(c => c.id === newCampus)?.name || newCampus)
    setShowCreate(false)
    setNewDate("")
    setNewCampus("")
  }

  return (
    <div className="phone-frame pb-20">
      <PageHeader
        title="拼单"
        subtitle="找人拼一车更划算"
        right={
          currentUser.isAdmin && (
            <button
              onClick={() => setShowMerge(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-primary/10 text-orange-primary"
            >
              <Plus size={12} />
              合并
            </button>
          )
        }
      />

      <div className="px-5 py-3 space-y-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          {["", "today", "tomorrow"].map(key => {
            const label = key === "" ? "全部" : key === "today" ? "今天" : "明天"
            const active = filterDate === key
            return (
              <button
                key={key}
                onClick={() => setFilterDate(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-orange-primary text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {label}
              </button>
            )
          })}
          <input
            type="date"
            value={filterDate === "today" || filterDate === "tomorrow" ? "" : filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-500"
          />
        </div>

        <div className="relative">
          <select
            value={filterCampus}
            onChange={e => setFilterCampus(e.target.value)}
            className="input-field appearance-none pr-8 text-sm"
          >
            <option value="">全部校区</option>
            {CAMPUSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Truck size={40} strokeWidth={1.2} />
            <p className="mt-2 text-sm">暂无拼单</p>
            <button onClick={() => setShowCreate(true)} className="mt-4 text-orange-primary text-sm font-medium">
              创建一个拼单 →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onOpen={() => setSelectedGroup(group)}
                canJoin={canJoinGroup(group)}
                onJoin={() => handleJoin(group)}
                isAdmin={currentUser.isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {currentUser.isAdmin && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreate(true)}
          className="fixed bottom-[72px] right-4 w-12 h-12 bg-orange-primary text-white rounded-full shadow-lg shadow-orange-primary/30 flex items-center justify-center z-30"
        >
          <Plus size={22} />
        </motion.button>
      )}

      {selectedGroup && (
        <GroupDrawer
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          isAdmin={currentUser.isAdmin}
        />
      )}

      {showCreate && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h3 className="font-bold text-navy-primary">创建拼单</h3>
                <button onClick={() => setShowCreate(false)} className="p-1">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input-field" />
                <div className="relative">
                  <select value={newCampus} onChange={e => setNewCampus(e.target.value)} className="input-field appearance-none pr-8 w-full">
                    <option value="">选择校区</option>
                    {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreate} className="btn-primary w-full">
                  创建拼单
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {showMerge && <MergePanel onClose={() => setShowMerge(false)} />}
    </div>
  )
}
