import React, { createContext, useReducer } from 'react'

export type Task = {
  id: number
  title: string
  body: string
  isDone: boolean
  deadline: number
  createdAt: number
}

type TaskState = {
  tasks: Task[]
}

type TaskAction =
  | {
      type: 'SET_TASKS'
      payload: {
        tasks: Task[]
      }
    }
  | {
      type: 'ADD_TASK'
      payload: {
        task: Task
      }
    }
  | {
      type: 'REMOVE_TASK'
      payload: {
        task: Task
      }
    }
  | {
      type: 'UPDATE_TASK'
      payload: {
        task: Task
      }
    }

const initialState: TaskState = {
  tasks: []
}

const reducer = (state = initialState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        tasks: [...state.tasks, action.payload.task]
      }
    case 'REMOVE_TASK':
      return {
        tasks: state.tasks.filter(task => task.id !== action.payload.task.id)
      }
    case 'UPDATE_TASK':
      return {
        tasks: state.tasks.map(task =>
          task.id === action.payload.task.id ? action.payload.task : task
        )
      }
    case 'SET_TASKS':
      return {
        tasks: action.payload.tasks
      }
    default:
      return state
  }
}

export const TaskContext = createContext<{
  state: TaskState
  dispatch: (action: TaskAction) => void
}>(null as any)

const TaskProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>
}

export default TaskProvider
