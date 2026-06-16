import { create } from "zustand"
import type { Order, GroupOrder, BargainMessage, Review, TodoItem, OrderItem } from "@/types"
import { MOCK_ORDERS, MOCK_GROUP_ORDERS, MOCK_BARGAINS, MOCK_REVIEWS, CURRENT_USER, DEFAULT_TODOS } from "@/data/orders"

interface AppState {
  currentUser: typeof CURRENT_USER
  orders: Order[]
  groupOrders: GroupOrder[]
  bargains: BargainMessage[]
  reviews: Review[]
  todos: TodoItem[]

  addOrder: (order: Omit<Order, "id" | "createdAt" | "handoverCode" | "userId" | "status">) => string
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  joinGroup: (groupOrderId: string, orderId: string) => void
  createGroup: (date: string, area: string) => string
  confirmGroup: (groupOrderId: string) => void
  addBargain: (orderId: string, content: string, type: BargainMessage["type"]) => void
  addReview: (orderId: string, punctuality: number, campusFamiliarity: number, tags: string[]) => void
  toggleTodo: (todoId: string) => void
  initTodos: (leaveDate: string) => void
  setCurrentUserAdmin: (isAdmin: boolean) => void
  getUserOrders: () => Order[]
  getOrderByGroup: (groupOrderId: string) => Order[]
}

const generateId = () => Math.random().toString(36).substring(2, 8)
const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: CURRENT_USER,
  orders: [...MOCK_ORDERS],
  groupOrders: [...MOCK_GROUP_ORDERS],
  bargains: [...MOCK_BARGAINS],
  reviews: [...MOCK_REVIEWS],
  todos: [],

  addOrder: (orderData) => {
    const id = `ord${generateId()}`
    const handoverCode = generateCode()
    const newOrder: Order = {
      ...orderData,
      id,
      userId: get().currentUser.id,
      status: "pending",
      handoverCode,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ orders: [...state.orders, newOrder] }))
    return id
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }))
  },

  joinGroup: (groupOrderId, orderId) => {
    set((state) => ({
      groupOrders: state.groupOrders.map((g) =>
        g.id === groupOrderId
          ? {
              ...g,
              memberCount: g.memberCount + 1,
              orderIds: [...g.orderIds, orderId],
            }
          : g
      ),
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, groupOrderId, status: "grouped" as const } : o
      ),
    }))
  },

  createGroup: (date, area) => {
    const id = `grp${generateId()}`
    const newGroup: GroupOrder = {
      id,
      date,
      area,
      memberCount: 0,
      maxCapacity: 4,
      sharedFee: 60,
      status: "forming",
      orderIds: [],
    }
    set((state) => ({ groupOrders: [...state.groupOrders, newGroup] }))
    return id
  },

  confirmGroup: (groupOrderId) => {
    set((state) => ({
      groupOrders: state.groupOrders.map((g) =>
        g.id === groupOrderId ? { ...g, status: "confirmed" as const } : g
      ),
      orders: state.orders.map((o) =>
        o.groupOrderId === groupOrderId ? { ...o, status: "delivering" as const } : o
      ),
    }))
  },

  addBargain: (orderId, content, type) => {
    const id = `bg${generateId()}`
    const msg: BargainMessage = {
      id,
      orderId,
      fromUserId: get().currentUser.id,
      content,
      type,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ bargains: [...state.bargains, msg] }))
  },

  addReview: (orderId, punctuality, campusFamiliarity, tags) => {
    const id = `rv${generateId()}`
    const review: Review = {
      id,
      orderId,
      punctuality,
      campusFamiliarity,
      tags,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ reviews: [...state.reviews, review] }))
  },

  toggleTodo: (todoId) => {
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)),
    }))
  },

  initTodos: (leaveDate) => {
    const userId = get().currentUser.id
    const todos: TodoItem[] = DEFAULT_TODOS.map((t, i) => ({
      id: `todo${i + 1}`,
      userId,
      leaveDate,
      content: t.content,
      done: false,
    }))
    set({ todos })
  },

  setCurrentUserAdmin: (isAdmin) => {
    set((state) => ({ currentUser: { ...state.currentUser, isAdmin } }))
  },

  getUserOrders: () => {
    const userId = get().currentUser.id
    return get().orders.filter((o) => o.userId === userId)
  },

  getOrderByGroup: (groupOrderId) => {
    return get().orders.filter((o) => o.groupOrderId === groupOrderId)
  },
}))
