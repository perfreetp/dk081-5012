export type Scenario = "same_school" | "off_campus" | "recycle"
export type DeliveryMode = "self_pickup" | "deliver"
export type Difficulty = "easy" | "medium" | "hard"
export type OrderStatus = "pending" | "grouped" | "delivering" | "completed"
export type GroupStatus = "forming" | "confirmed" | "delivering" | "completed"
export type BargainType = "offer" | "accept" | "reject"

export interface OrderItem {
  id: string
  orderId: string
  furnitureType: string
  difficulty: Difficulty
  photo?: string
  description: string
}

export interface Order {
  id: string
  userId: string
  scenario: Scenario
  campus: string
  building: string
  leaveDate: string
  deliveryMode: DeliveryMode
  newAddress?: string
  price: number
  charity: boolean
  urgent: boolean
  bargaining: boolean
  status: OrderStatus
  groupOrderId?: string
  handoverCode: string
  createdAt: string
  items: OrderItem[]
}

export interface GroupOrder {
  id: string
  date: string
  area: string
  memberCount: number
  maxCapacity: number
  sharedFee: number
  status: GroupStatus
  orderIds: string[]
}

export interface CampusRule {
  id: string
  campus: string
  building: string
  moveTimeLimit: string
  truckAccessTime: string
  gateRegistration: string
  notes: string
}

export interface User {
  id: string
  name: string
  phone: string
  isAdmin: boolean
}

export interface BargainMessage {
  id: string
  orderId: string
  fromUserId: string
  content: string
  type: BargainType
  createdAt: string
}

export interface Review {
  id: string
  orderId: string
  punctuality: number
  campusFamiliarity: number
  tags: string[]
  createdAt: string
}

export interface TodoItem {
  id: string
  userId: string
  orderId: string
  leaveDate: string
  content: string
  done: boolean
}

export const SCENARIO_LABELS: Record<Scenario, string> = {
  same_school: "卖给同校同学",
  off_campus: "卖给校外买家",
  recycle: "直接清空回收",
}

export const SCENARIO_ICONS: Record<Scenario, string> = {
  same_school: "🏫",
  off_campus: "🏠",
  recycle: "♻️",
}

export const DELIVERY_LABELS: Record<DeliveryMode, string> = {
  self_pickup: "买家自提",
  deliver: "送到新租房",
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "易拆装",
  medium: "中等难度",
  hard: "较难拆装",
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-mint/20 text-mint",
  medium: "bg-honey/20 text-amber-700",
  hard: "bg-rose/20 text-red-600",
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待拼单",
  grouped: "已拼单",
  delivering: "配送中",
  completed: "已交接",
}

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  forming: "拼单中",
  confirmed: "已确认",
  delivering: "配送中",
  completed: "已完成",
}

export const FURNITURE_TYPES = [
  { label: "桌子", emoji: "🪑", difficulty: "easy" as Difficulty },
  { label: "椅子", emoji: "💺", difficulty: "easy" as Difficulty },
  { label: "床垫", emoji: "🛏️", difficulty: "easy" as Difficulty },
  { label: "书柜", emoji: "📚", difficulty: "medium" as Difficulty },
  { label: "上床下桌", emoji: "🛏️", difficulty: "hard" as Difficulty },
  { label: "组合柜", emoji: "🗄️", difficulty: "hard" as Difficulty },
  { label: "铁架床", emoji: "🛏️", difficulty: "medium" as Difficulty },
  { label: "衣柜", emoji: "👔", difficulty: "medium" as Difficulty },
  { label: "其他", emoji: "📦", difficulty: "easy" as Difficulty },
]
