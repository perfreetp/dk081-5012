import { create } from "zustand"
import type { Order, GroupOrder, BargainMessage, Review, TodoItem, OrderItem } from "@/types"
import { MOCK_ORDERS, MOCK_GROUP_ORDERS, MOCK_BARGAINS, MOCK_REVIEWS, CURRENT_USER, DEFAULT_TODOS } from "@/data/orders"

const STORAGE_KEY = "banhaojia-store-v1"

interface PersistedState {
  currentUser: typeof CURRENT_USER
  orders: Order[]
  groupOrders: GroupOrder[]
  bargains: BargainMessage[]
  reviews: Review[]
  todosByOrderId: Record<string, TodoItem[]>
}

interface AppState extends PersistedState {
  addOrder: (order: Omit<Order, "id" | "createdAt" | "handoverCode" | "userId" | "status">) => string
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  joinGroup: (groupOrderId: string, orderId: string) => void
  createGroup: (date: string, area: string) => string
  confirmGroup: (groupOrderId: string) => void
  addBargain: (orderId: string, content: string, type: BargainMessage["type"]) => void
  addReview: (orderId: string, punctuality: number, campusFamiliarity: number, tags: string[]) => void
  toggleTodo: (orderId: string, todoId: string) => void
  initTodos: (orderId: string, leaveDate: string) => void
  setCurrentUserAdmin: (isAdmin: boolean) => void
  getUserOrders: () => Order[]
  getOrderByGroup: (groupOrderId: string) => Order[]
  getTodosByOrder: (orderId: string) => TodoItem[]
}

const generateId = () => Math.random().toString(36).substring(2, 8)
const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

const loadState = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed
  } catch {
    return null
  }
}

const savedState = loadState()

const initialState: PersistedState = savedState || {
  currentUser: CURRENT_USER,
  orders: [...MOCK_ORDERS],
  groupOrders: [...MOCK_GROUP_ORDERS],
  bargains: [...MOCK_BARGAINS],
  reviews: [...MOCK_REVIEWS],
  todosByOrderId: {},
}

const persist = (state: PersistedState) => {
  try {
    const toSave: PersistedState = {
      currentUser: state.currentUser,
      orders: state.orders,
      groupOrders: state.groupOrders,
      bargains: state.bargains,
      reviews: state.reviews,
      todosByOrderId: state.todosByOrderId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

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
    set((state) => {
      const next = { ...state, orders: [...state.orders, newOrder] }
      persist(next)
      return next
    })
    return id
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const next = {
        ...state,
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      }
      persist(next)
      return next
    })
  },

  joinGroup: (groupOrderId, orderId) => {
    set((state) => {
      const next = {
        ...state,
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
      }
      persist(next)
      return next
    })
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
    set((state) => {
      const next = { ...state, groupOrders: [...state.groupOrders, newGroup] }
      persist(next)
      return next
    })
    return id
  },

  confirmGroup: (groupOrderId) => {
    set((state) => {
      const next = {
        ...state,
        groupOrders: state.groupOrders.map((g) =>
          g.id === groupOrderId ? { ...g, status: "confirmed" as const } : g
        ),
        orders: state.orders.map((o) =>
          o.groupOrderId === groupOrderId ? { ...o, status: "delivering" as const } : o
        ),
      }
      persist(next)
      return next
    })
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
    set((state) => {
      const next = { ...state, bargains: [...state.bargains, msg] }
      persist(next)
      return next
    })
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
    set((state) => {
      const next = { ...state, reviews: [...state.reviews, review] }
      persist(next)
      return next
    })
  },

  toggleTodo: (orderId, todoId) => {
    set((state) => {
      const orderTodos = state.todosByOrderId[orderId] || []
      const updated = orderTodos.map((t) =>
        t.id === todoId ? { ...t, done: !t.done } : t
      )
      const next = {
        ...state,
        todosByOrderId: { ...state.todosByOrderId, [orderId]: updated },
      }
      persist(next)
      return next
    })
  },

  initTodos: (orderId, leaveDate) => {
    const userId = get().currentUser.id
    const todos: TodoItem[] = DEFAULT_TODOS.map((t, i) => ({
      id: `todo-${orderId}-${i + 1}`,
      userId,
      orderId,
      leaveDate,
      content: t.content,
      done: false,
    }))
    set((state) => {
      const next = {
        ...state,
        todosByOrderId: { ...state.todosByOrderId, [orderId]: todos },
      }
      persist(next)
      return next
    })
  },

  setCurrentUserAdmin: (isAdmin) => {
    set((state) => {
      const next = { ...state, currentUser: { ...state.currentUser, isAdmin } }
      persist(next)
      return next
    })
  },

  getUserOrders: () => {
    const userId = get().currentUser.id
    return get().orders.filter((o) => o.userId === userId)
  },

  getOrderByGroup: (groupOrderId) => {
    return get().orders.filter((o) => o.groupOrderId === groupOrderId)
  },

  getTodosByOrder: (orderId) => {
    return get().todosByOrderId[orderId] || []
  },
}))
