import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Clock,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import { CAMPUS_RULES, CAMPUSES, FAQ_ITEMS } from "@/data/campus"
import { PageHeader } from "@/components/PageHeader"

export default function RulesPage() {
  const [search, setSearch] = useState("")
  const [activeCampus, setActiveCampus] = useState("全部")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = CAMPUS_RULES.filter((r) => {
    const matchCampus = activeCampus === "全部" || r.campus === activeCampus
    const q = search.toLowerCase()
    const matchSearch =
      !q || r.building.toLowerCase().includes(q) || r.campus.toLowerCase().includes(q)
    return matchCampus && matchSearch
  })

  const grouped = filtered.reduce<Record<string, typeof CAMPUS_RULES>>((acc, r) => {
    if (!acc[r.building]) acc[r.building] = []
    acc[r.building].push(r)
    return acc
  }, {})

  return (
    <div className="phone-frame">
      <PageHeader title="校区规则" subtitle="了解各楼栋搬运要求" />

      <div className="px-4 pt-4 pb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="搜索楼栋或校区..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["全部", ...CAMPUSES.map((c) => c.name)].map((name) => (
            <button
              key={name}
              onClick={() => setActiveCampus(name)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCampus === name
                  ? "bg-orange-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div>
          <h2 className="section-title">搬运规则</h2>

          {Object.keys(grouped).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">没有匹配的规则</p>
          )}

          <div className="space-y-3">
            {Object.entries(grouped).map(([building, rules]) =>
              rules.map((rule) => (
                <div key={rule.id} className="card">
                  <button
                    onClick={() => toggle(rule.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="font-semibold text-navy-primary">{building}</span>
                    {expanded.has(rule.id) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded.has(rule.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 mt-0.5 shrink-0 text-orange-primary" />
                            <div>
                              <p className="text-xs text-slate-500">搬运时间</p>
                              <p className="text-sm text-orange-primary font-medium">
                                {rule.moveTimeLimit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Truck className="w-4 h-4 mt-0.5 shrink-0 text-mint" />
                            <div>
                              <p className="text-xs text-slate-500">货车通行</p>
                              <p className="text-sm text-mint font-medium">
                                {rule.truckAccessTime}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Shield className="w-4 h-4 mt-0.5 shrink-0 text-navy-primary" />
                            <div>
                              <p className="text-xs text-slate-500">门岗登记</p>
                              <p className="text-sm text-navy-primary font-medium">
                                {rule.gateRegistration}
                              </p>
                            </div>
                          </div>

                          {rule.notes && (
                            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-honey" />
                              <p className="text-xs text-slate-500">{rule.notes}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )),
            )}
          </div>
        </div>

        <div>
          <h2 className="section-title">常见问题</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => {
              const faqId = `faq-${i}`
              return (
                <div key={faqId} className="card">
                  <button
                    onClick={() => toggle(faqId)}
                    className="w-full flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-orange-primary" />
                      <span className="text-sm font-medium text-navy-primary text-left">
                        {faq.q}
                      </span>
                    </div>
                    {expanded.has(faqId) ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded.has(faqId) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-6">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
