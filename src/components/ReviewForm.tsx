import { useState } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Star } from "lucide-react"

interface ReviewFormProps {
  orderId: string
  onSubmitted?: () => void
}

const QUICK_TAGS = ["准时到达", "态度好", "熟悉校园", "小心轻放", "效率高", "迟到", "不熟悉路线"]

export function ReviewForm({ orderId, onSubmitted }: ReviewFormProps) {
  const { addReview } = useAppStore()
  const [punctuality, setPunctuality] = useState(0)
  const [campusFamiliarity, setCampusFamiliarity] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    if (punctuality === 0 || campusFamiliarity === 0) return
    addReview(orderId, punctuality, campusFamiliarity, selectedTags)
    setSubmitted(true)
    onSubmitted?.()
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-6"
      >
        <span className="text-4xl">🎉</span>
        <p className="text-sm text-navy-primary font-medium mt-2">感谢你的评价！</p>
      </motion.div>
    )
  }

  return (
    <div className="card">
      <h3 className="section-title">完工评价</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-2">师傅准时度</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileTap={{ scale: 0.8 }}
                onClick={() => setPunctuality(star)}
                className="p-0.5"
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= punctuality ? "text-honey fill-honey" : "text-slate-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-600 mb-2">校园流程熟悉度</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileTap={{ scale: 0.8 }}
                onClick={() => setCampusFamiliarity(star)}
                className="p-0.5"
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= campusFamiliarity ? "text-honey fill-honey" : "text-slate-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-600 mb-2">快捷标签</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag)}
                className={`tag transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-orange-primary/20 text-orange-primary"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={punctuality === 0 || campusFamiliarity === 0}
          className="btn-primary w-full"
        >
          提交评价
        </motion.button>
      </div>
    </div>
  )
}
