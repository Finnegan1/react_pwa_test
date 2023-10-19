import {create} from 'zustand'
import { devtools } from 'zustand/middleware'

export enum ChangeType {
  AddTodo,
  RemoveTodo,
  LoadTodos,
}

export type change = {
  type: ChangeType
  data: any
}

export type changeStore = {
  offlineChanges: change[],
  addChange: (change: change) => void
  removeChange: (change: change) => void
}

export const useChangeStore = create(devtools<changeStore>((set) => ({
  offlineChanges: [],
  addChange: (change) => set((state) => ({ offlineChanges: [...state.offlineChanges, change] })),
  removeChange: (change) => set((state) => ({ offlineChanges: state.offlineChanges.filter((t) => t !== change) })),
}), { name: 'changeStore'}))
