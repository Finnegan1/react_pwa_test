import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DataManager } from '../dataManager'


//zustand

export type todo = {
  id: number
  userId: number
  todo: string
  completed: boolean
}

type todoStore = {
  todos: todo[],
  addTodo: (todo: todo) => void
  removeTodo: (todo: todo) => void
  loadTodos: () => void
  syncTodos: () => void
}

const dataManager = new DataManager();

export const useTodoStore = create(devtools<todoStore>((set) => ({
  todos: [],
  addTodo: (todo) => {
    dataManager.addTask(todo);
  },
  removeTodo: (todo) => {
    dataManager.removeTask(todo);
  },
  loadTodos: () => {
    dataManager.loadTasks();
  },
  syncTodos: () => {
    dataManager.syncTasks();
  }
}), {name: 'todoStore'}))
