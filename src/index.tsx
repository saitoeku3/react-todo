import React, { useContext, useEffect, useState } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import 'normalize.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFilter, faSort, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import Button from './components/Button'
import TaskCard from './components/Card'
import Modal from './components/Modal'
import RadioButton from './components/RadioButton'
import TaskProvider, { Task, TaskContext } from './context/task'

type FilterCondition = 'DONE' | 'NOT_DONE' | 'ALL'
type SortCondition = 'CREATED_AT' | 'DEADLINE'
type SortOrder = 'ASC' | 'DESC'

const App = () => {
  const { state, dispatch } = useContext(TaskContext)
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('ALL')
  const [sortCondition, setSortCondition] = useState<SortCondition>('CREATED_AT')
  const [sortOrder, setSortOrder] = useState<SortOrder>('ASC')
  const [openedNewModal, setOpenedNewModal] = useState<boolean>(false)

  const filterConditions: FilterCondition[] = ['ALL', 'DONE', 'NOT_DONE']
  const sortConditions: SortCondition[] = ['CREATED_AT', 'DEADLINE']
  const sortOrders: SortOrder[] = ['ASC', 'DESC']

  const taskFilter = (tasks: Task[], condition: FilterCondition): Task[] => {
    switch (condition) {
      case 'DONE':
        return tasks.filter(task => task.isDone === true)
      case 'NOT_DONE':
        return tasks.filter(task => task.isDone === false)
      default:
        return tasks
    }
  }

  const taskSort = (tasks: Task[], condition: SortCondition): Task[] => {
    if (condition === 'CREATED_AT' && sortOrder === 'DESC') {
      return tasks.sort((a, b) => b.createdAt - a.createdAt)
    } else if (condition === 'DEADLINE' && sortOrder === 'ASC') {
      return tasks.sort((a, b) => a.deadline - b.deadline)
    } else if (condition === 'DEADLINE' && sortOrder === 'DESC') {
      return tasks.sort((a, b) => b.deadline - a.deadline)
    }
    return tasks.sort((a, b) => a.createdAt - b.createdAt)
  }

  const taskList = taskFilter(taskSort(state.tasks, sortCondition), filterCondition).map(task => {
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
          <FontAwesomeIcon icon={faPlus} />
          <span style={{ marginLeft: '4px' }}>New</span>
        </NewButton>
      </div>
      {openedNewModal && <Modal closeModal={() => setOpenedNewModal(false)} />}
      <DisplayMenu>
        <div style={{ marginRight: '24px' }}>
          <FontAwesomeIcon icon={faFilter} />
          <span style={{ marginLeft: '4px' }}>Filter</span>
        </div>
        <div style={{ display: 'flex' }}>
          {filterConditions.map(condition => (
            <RadioButton
              key={condition}
              label={condition}
              name="filter"
              value={condition}
              checked={filterCondition === condition}
              onChange={event => setFilterCondition(event.target.value as FilterCondition)}
            />
          ))}
        </div>
      </DisplayMenu>
      <DisplayMenu>
        <div style={{ marginRight: '24px' }}>
          <FontAwesomeIcon icon={faSort} style={{ fontSize: '1.5rem' }} />
          <span style={{ marginLeft: '4px' }}>Sort</span>
        </div>
        <div style={{ display: 'flex' }}>
          {sortConditions.map(condition => (
            <RadioButton
              key={condition}
              label={condition}
              name="sort"
              value={condition}
              checked={sortCondition === condition}
              onChange={event => setSortCondition(event.target.value as SortCondition)}
            />
          ))}
        </div>
      </DisplayMenu>
      <DisplayMenu>
        <div style={{ marginRight: '24px' }}>
          <FontAwesomeIcon icon={faSortAmountDown} />
          <span style={{ marginLeft: '4px' }}>Order</span>
        </div>
        <div style={{ display: 'flex' }}>
          {sortOrders.map(condition => (
            <RadioButton
              key={condition}
              label={condition}
              name="order"
              value={condition}
              checked={sortOrder === condition}
              onChange={event => setSortOrder(event.target.value as SortOrder)}
            />
          ))}
        </div>
      </DisplayMenu>
      <ul style={{ padding: 0, marginTop: '32px' }}>{taskList}</ul>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 16px 25vw;
  color: #444;
`

const DisplayMenu = styled.div`
  display: flex;
  margin: 16px 0;
  justify-content: space-between;
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
