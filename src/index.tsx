import React, { useContext, useEffect, useState } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import 'normalize.css'
import TaskCard from './components/Card'
import TaskProvider, { Task, TaskContext } from './context/task'
import Button from './components/Button'
import Modal from './components/Modal'

type FilterCondition = 'DONE' | 'NOT_DONE' | 'ALL'

const App = () => {
  const { state, dispatch } = useContext(TaskContext)
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('ALL')
  const [openedNewModal, setOpenedNewModal] = useState<boolean>(false)

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
    const toggleIsDone = () => {
      const updatedTask: Task = { ...task, isDone: !task.isDone }
      dispatch({ type: 'UPDATE_TASK', payload: { task: updatedTask } })
    }
    return <TaskCard key={task.id} task={task} toggleCheck={toggleIsDone} />
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>To Do</h1>
        <NewButton bg="#62AFDB" color="#fff" onClick={() => setOpenedNewModal(true)}>
          New
        </NewButton>
      </div>
      {openedNewModal && <Modal closeModal={() => setOpenedNewModal(false)} />}
      <Filter>
        <div>Filter</div>
        <div>
          <Checkbox
            type="radio"
            name="filter"
            value="ALL"
            onChange={e => setFilterCondition(e.target.value as FilterCondition)}
            checked={filterCondition === 'ALL'}
          />
          <label>All</label>
        </div>
        <Checkbox
          type="radio"
          name="filter"
          value="DONE"
          onChange={e => setFilterCondition(e.target.value as FilterCondition)}
          checked={filterCondition === 'DONE'}
        />
        <label>Done</label>
        <div>
          <Checkbox
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
  padding: 16px 30vw;
`

const Filter = styled.div`
  margin: 16px 0 0 100px;
`

const Checkbox = styled.input`
  cursor: pointer;
  margin: 8px 8px 0 0;
`

const NewButton = styled(Button)`
  margin: auto 0;
`

render(
  <TaskProvider>
    <App />
  </TaskProvider>,
  document.querySelector('#root')
)
