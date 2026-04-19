'use client'

import { create } from 'zustand'

export type CartItem = {
  productId: string
  name: string
  pricePerUnit: number
  profitPerUnit: number
  quantity: number
}

type CartStore = {
  teamId: string | null
  items: CartItem[]
  setTeamId: (id: string) => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  totalAmount: () => number
  totalProfit: () => number
  totalItems: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  teamId: null,
  items: [],

  setTeamId: (id) => set({ teamId: id, items: [] }),

  addItem: (item) => {
    const items = get().items
    const existing = items.find((i) => i.productId === item.productId)
    if (existing) {
      set({ items: items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i) })
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] })
    }
  },

  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.productId !== productId) }),

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({ items: get().items.map((i) => i.productId === productId ? { ...i, quantity } : i) })
  },

  clear: () => set({ items: [] }),

  totalAmount: () => get().items.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0),
  totalProfit: () => get().items.reduce((s, i) => s + i.profitPerUnit * i.quantity, 0),
  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
}))
