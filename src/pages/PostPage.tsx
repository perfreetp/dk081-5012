import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown, Camera, Shield, Package, Plus, Trash2, User, Phone, CheckCircle } from "lucide-react"
import type { Scenario, DeliveryMode, Difficulty, OrderItem } from "@/types"
import { FURNITURE_TYPES, DIFFICULTY_LABELS, DELIVERY_LABELS } from "@/types"
import { useAppStore } from "@/store/useAppStore"
import { PageHeader } from "@/components/PageHeader"
import { ScenarioCard } from "@/components/ScenarioCard"
import { FurnitureTag, DifficultyBadge, TagBadge } from "@/components/Badges"
import { CAMPUSES, BUILDINGS, CAMPUS_RULES } from "@/data/campus"

const SA = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }

export default function PostPage() {
  const navigate = useNavigate()
  const { addOrder, initTodos, currentUser, setCurrentUserAdmin } = useAppStore()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [selFurniture, setSelFurniture] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [itemDesc, setItemDesc] = useState("")
  const [items, setItems] = useState<Array<{ furnitureType: string; difficulty: Difficulty; description: string }>>([])
  const [campusId, setCampusId] = useState("")
  const [building, setBuilding] = useState("")
  const [leaveDate, setLeaveDate] = useState("")
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("self_pickup")
  const [newAddress, setNewAddress] = useState("")
  const [charity, setCharity] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [price, setPrice] = useState(0)
  const [bargaining, setBargaining] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [batchOrders, setBatchOrders] = useState<Array<{ id: string; studentName: string; studentPhone: string; building: string; campus: string }>>([])
  const [studentName, setStudentName] = useState("")
  const [studentPhone, setStudentPhone] = useState("")
  const [showItemHint, setShowItemHint] = useState(false)

  const campusName = CAMPUSES.find(c => c.id === campusId)?.name || ""
  const buildings = campusId ? BUILDINGS[campusId] || [] : []
  const rule = CAMPUS_RULES.find(r => r.building === building)

  const selectFurniture = (label: string) => {
    setSelFurniture(label)
    const ft = FURNITURE_TYPES.find(f => f.label === label)
    if (ft) setDifficulty(ft.difficulty)
  }

  const addItem = () => {
    if (!selFurniture) return
    setItems(prev => [...prev, { furnitureType: selFurniture, difficulty, description: itemDesc }])
    setSelFurniture("")
    setItemDesc("")
    setShowItemHint(false)
  }

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))

  const autoAddPendingItem = () => {
    if (selFurniture) {
      addItem()
      return true
    }
    return false
  }

  const resetItemSection = () => {
    setItems([])
    setSelFurniture("")
    setItemDesc("")
  }

  const submitOrder = () => {
    if (!scenario) return
    if (!campusName || !building || !leaveDate) return

    if (items.length === 0 && !selFurniture) {
      setShowItemHint(true)
      return
    }

    const finalItems = [...items]
    if (selFurniture && items.length === 0) {
      finalItems.push({ furnitureType: selFurniture, difficulty, description: itemDesc })
    }

    if (finalItems.length === 0) {
      setShowItemHint(true)
      return
    }

    if (batchMode) {
      if (!studentName.trim()) return
    }

    const orderItems: OrderItem[] = finalItems.map((item, i) => ({
      id: `it${Date.now()}${i}`, orderId: "", furnitureType: item.furnitureType,
      difficulty: item.difficulty, description: item.description,
    }))

    const orderId = addOrder({
      scenario, campus: campusName, building, leaveDate, deliveryMode,
      newAddress: deliveryMode === "deliver" ? newAddress : undefined,
      price: charity ? 0 : price, charity, urgent, bargaining, items: orderItems,
      ...(batchMode && { studentName, studentPhone, userId: `stu_${Date.now()}` }),
    })
    initTodos(orderId, leaveDate)

    if (batchMode) {
      setBatchOrders(prev => [...prev, { id: orderId, studentName, studentPhone, building, campus: campusName }])
      resetItemSection()
      setStudentName("")
      setStudentPhone("")
      return
    }

    setSubmitted(true)
    setTimeout(() => navigate("/progress"), 1200)
  }

  if (submitted) {
    return (
      <div className="phone-frame flex items-center justify-center min-h-screen">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="text-6xl mb-4">🎉</motion.div>
          <p className="text-lg font-bold text-navy-primary">发布成功！</p>
          <p className="text-sm text-slate-500 mt-1">正在跳转进度页...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="phone-frame pb-[120px]">
      <PageHeader
        title="发单"
        subtitle="发布你的家具转单信息"
        right={
          <button
            onClick={() => {
              setCurrentUserAdmin(!currentUser.isAdmin)
              if (currentUser.isAdmin) {
                setBatchMode(false)
                setBatchOrders([])
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentUser.isAdmin
                ? "bg-orange-primary/10 text-orange-primary"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Shield size={12} />
            {currentUser.isAdmin ? "管理员" : "管理员入口"}
          </button>
        }
      />

      <div className="px-5 py-4 space-y-4">
        {batchMode && batchOrders.length > 0 && (
          <motion.div {...SA} transition={{ delay: 0.02 }}>
            <div className="card bg-mint/5 border-mint/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy-primary">已批量添加 {batchOrders.length} 单</span>
                <button onClick={() => navigate("/progress")} className="text-xs text-orange-primary font-medium">
                  查看全部 →
                </button>
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {batchOrders.map((o) => (
                  <div key={o.id} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle size={12} className="text-mint shrink-0" />
                    <span className="font-medium">{o.studentName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="truncate">{o.campus} {o.building}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentUser.isAdmin && batchMode && (
          <motion.div {...SA} transition={{ delay: 0.04 }}>
            <div className="card">
              <h3 className="section-title">学生信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="学生姓名"
                    className="input-field pl-8"
                  />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={studentPhone}
                    onChange={e => setStudentPhone(e.target.value)}
                    placeholder="手机号"
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div {...SA} transition={{ delay: 0.06 }}>
          <div className="card">
            <h3 className="section-title">选择场景</h3>
            <div className="flex gap-3">
              {(["same_school", "off_campus", "recycle"] as Scenario[]).map(s => (
                <ScenarioCard key={s} scenario={s} selected={scenario === s} onClick={() => setScenario(s)} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...SA} transition={{ delay: 0.1 }}>
          <div className="card">
            <h3 className="section-title">家具物品</h3>
            <div className="flex flex-wrap gap-2">
              {FURNITURE_TYPES.map(f => (
                <FurnitureTag key={f.label} label={f.label} emoji={f.emoji} selected={selFurniture === f.label} onClick={() => selectFurniture(f.label)} />
              ))}
            </div>

            {selFurniture && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-400">上床下桌→难 · 组合柜→难 · 铁架床→中 · 普通桌椅→易</p>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${difficulty === d ? "bg-orange-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </div>
                <textarea value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="描述物品状况..." className="input-field resize-none h-16" />
                <div className="flex items-center gap-3">
                  <button onClick={addItem} className="flex items-center gap-1 text-sm text-orange-primary font-medium"><Plus size={14} /> 添加到清单</button>
                  <button className="flex items-center gap-1 text-sm text-slate-400"><Camera size={14} /> 拍照</button>
                </div>
              </div>
            )}

            <AnimatePresence>
              {items.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                  <p className="text-xs text-slate-400 mb-2">已添加 {items.length} 件物品</p>
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy-primary">{item.furnitureType}</span>
                        <DifficultyBadge difficulty={item.difficulty} />
                        {item.description && <span className="text-xs text-slate-400 truncate max-w-[100px]">{item.description}</span>}
                      </div>
                      <button onClick={() => removeItem(idx)} className="text-rose"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showItemHint && items.length === 0 && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-honey/15 border border-honey/40 rounded-xl p-2.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs text-amber-700">
                      <p className="font-medium">还没添加物品哦</p>
                      <p className="mt-0.5">选好家具后记得点「添加到清单」</p>
                      <button onClick={addItem} className="mt-2 text-orange-primary font-medium" disabled={!selFurniture}>
                        {selFurniture ? `添加「${selFurniture}」→` : "请先选择家具类型"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...SA} transition={{ delay: 0.15 }}>
          <div className="card">
            <h3 className="section-title">位置与时间</h3>
            <div className="relative mb-3">
              <select value={campusId} onChange={e => { setCampusId(e.target.value); setBuilding("") }} className="input-field appearance-none pr-8">
                <option value="">选择校区</option>
                {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative mb-3">
              <select value={building} onChange={e => setBuilding(e.target.value)} className="input-field appearance-none pr-8">
                <option value="">选择楼栋</option>
                {buildings.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <input type="date" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} className="input-field" />
            <AnimatePresence>
              {rule && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-medium"><AlertTriangle size={12} /> 搬运须知</div>
                  <p className="text-xs text-slate-600">🕐 {rule.moveTimeLimit}</p>
                  <p className="text-xs text-slate-600">🚚 {rule.truckAccessTime}</p>
                  <p className="text-xs text-slate-600">📋 {rule.gateRegistration}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...SA} transition={{ delay: 0.2 }}>
          <div className="card">
            <h3 className="section-title">交接方式</h3>
            <div className="flex gap-3">
              {(["self_pickup", "deliver"] as DeliveryMode[]).map(m => (
                <motion.button key={m} whileTap={{ scale: 0.97 }} onClick={() => setDeliveryMode(m)} className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${deliveryMode === m ? "border-orange-primary bg-orange-primary/5" : "border-slate-200"}`}>
                  <Package size={20} className={`mx-auto mb-1 ${deliveryMode === m ? "text-orange-primary" : "text-slate-400"}`} />
                  <span className={`text-xs font-medium ${deliveryMode === m ? "text-navy-primary" : "text-slate-500"}`}>{DELIVERY_LABELS[m]}</span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {deliveryMode === "deliver" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                  <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="输入新地址..." className="input-field" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...SA} transition={{ delay: 0.25 }}>
          <div className="card">
            <h3 className="section-title">标签与定价</h3>
            <div className="flex gap-2 mb-3">
              <TagBadge label="公益转赠" color="bg-rose/20 text-rose" selected={charity} onClick={() => { setCharity(!charity); if (!charity) { setPrice(0); setUrgent(false) } }} />
              <TagBadge label="低价急出" color="bg-honey/20 text-amber-700" selected={urgent} onClick={() => setUrgent(!urgent)} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-slate-600">¥</span>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} disabled={charity} className="input-field flex-1" placeholder="价格" />
              <span className="text-sm text-slate-600">元</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">允许议价</span>
              <button onClick={() => setBargaining(!bargaining)} className={`w-11 h-6 rounded-full transition-colors relative ${bargaining ? "bg-orange-primary" : "bg-slate-200"}`}>
                <motion.div animate={{ x: bargaining ? 20 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
              </button>
            </div>
          </div>
        </motion.div>

        {currentUser.isAdmin && (
          <motion.div {...SA} transition={{ delay: 0.3 }}>
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-orange-primary" />
                  <span className="text-sm font-medium text-navy-primary">批量发单模式</span>
                  {batchMode && batchOrders.length > 0 && (
                    <span className="tag bg-mint/15 text-mint">{batchOrders.length}单</span>
                  )}
                </div>
                <button onClick={() => {
                  setBatchMode(!batchMode)
                  if (batchMode) setBatchOrders([])
                }} className={`w-11 h-6 rounded-full transition-colors relative ${batchMode ? "bg-orange-primary" : "bg-slate-200"}`}>
                  <motion.div animate={{ x: batchMode ? 20 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">开启后可连续为多名学生代发订单，每单需填写学生信息</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-[56px] left-0 right-0 max-w-[480px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-100 px-5 py-3 z-40">
        <motion.button whileTap={{ scale: 0.97 }} onClick={submitOrder} className="btn-primary w-full">
          {batchMode ? "添加此单到批次" : "发布订单"}
        </motion.button>
      </div>
    </div>
  )
}
