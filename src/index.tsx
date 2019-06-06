import React, { useContext, useEffect, useState } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import TaskCard from './components/TaskCard'
import TaskProvider, { Task, TaskContext } from './context/task'
import TaskForm from './components/TaskForm'

type FilterCondition = 'DONE' | 'NOT_DONE' | 'ALL'

const App = () => {
  const { state, dispatch } = useContext(TaskContext)
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('ALL')

  const taskListFilter = (tasks: Task[], condition: FilterCondition): Task[] => {
    switch (condition) {
      case 'DONE':
        return tasks.filter(task => task.isDone === true)
      case 'NOT_DONE':
        return tasks.filter(task => task.isDone === false)
      default:
        return tasks
    }
  }

  const taskList = taskListFilter(state.tasks, filterCondition).map(task => {
    const toggleDone = () => {
      const updatedTask: Task = {
        ...task,
        isDone: !task.isDone
      }
      dispatch({ type: 'UPDATE_TASK', payload: { task: updatedTask } })
    }
    return <TaskCard key={task.id} task={task} toggleCheck={toggleDone} />
  })

  // Set tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      dispatch({ type: 'SET_TASKS', payload: { tasks: JSON.parse(storedTasks) } })
    }
  }, [])

  // Store tasks to localStorage
  useEffect(() => {
    localStorage.setItem(
      'tasks',
      JSON.stringify(state.tasks.filter((task, index, self) => self.indexOf(task) === index))
    )
  }, [state.tasks])

  return (
    <Wrapper>
      <h1>To Do</h1>
      <TaskForm />
      <Filter>
        <div>Filter</div>
        <div>
          <input
            type="radio"
            name="filter"
            value="ALL"
            onChange={e => setFilterCondition(e.target.value as FilterCondition)}
            checked={filterCondition === 'ALL'}
          />
          <label>All</label>
        </div>
        <div>
          <input
            type="radio"
            name="filter"
            value="DONE"
            onChange={e => setFilterCondition(e.target.value as FilterCondition)}
            checked={filterCondition === 'DONE'}
          />
          <label>Done</label>
        </div>
        <div>
          <input
            type="radio"
            name="filter"
            value="NOT_DONE"
            onChange={e => setFilterCondition(e.target.value as FilterCondition)}
            checked={filterCondition === 'NOT_DONE'}
          />
          <label>Not Done</label>
        </div>
      </Filter>
      <ul style={{ padding: 0 }}>{taskList}</ul>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 16px 10vw;
`

const Filter = styled.div`
  margin: 50px 0;
`

render(
  <TaskProvider>
    <App />
  </TaskProvider>,
  document.querySelector('#root')
)
